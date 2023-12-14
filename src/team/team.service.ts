import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from '@prisma/client';
import { TeamMemberDto } from './dto';
import { SearchFieldEnum, TeamStatusEnum } from './entities';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
      const created = await this.prisma.team.create({
        data: { ...createTeamDto },
      });

      const team = await this.findOne(created.id)
      return team

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Team with the same data already exists.');
      } else {
        throw new InternalServerErrorException('Failed to create Team.');
      }
    }
  }

  async findAll(page: number = 1, pageSize: number = 10, searchField?: SearchFieldEnum, searchValue?: string | number) {

    const skip = (page - 1) * pageSize;
	  
		let whereCondition: Record<string, any> = {}

    whereCondition.is_deleted = false
	  
		if (searchField && searchValue !== undefined) {
		  if (searchField === SearchFieldEnum.Name) {
        whereCondition = {
          [searchField]: {
            contains: searchValue,
            mode: 'insensitive',
          },
        };
      } else if (searchField === SearchFieldEnum.Firstname || searchField === SearchFieldEnum.Lastname){
        whereCondition = {
          team_leader: {
            [searchField]: {
              contains: searchValue,
              mode: 'insensitive',
            }
          }
        }
      }
		}


    const teams = await this.prisma.team.findMany({
      include: {
        team_leader: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        teamMembers: true
      },
      orderBy: {
        name: 'asc'
      },
      skip,
		  take: pageSize,
		  where: whereCondition,
      // where: {
      //   is_deleted: false,
      // },
    });

    const totalTeams = await this.prisma.team.count({
			where: whereCondition,
		});

    return {
		  teams,
		  totalTeams,
		  currentPage: page,
		  totalPages: Math.ceil(totalTeams / pageSize),
		};

  }

  async findAllActive() {
    return await this.prisma.team.findMany({
      where: {
        status: TeamStatusEnum.Active,
        is_deleted: false,
      },
      include: {
        team_leader: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        teamMembers: true
      }
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        team_leader: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            type: true,
            Bart: {select: {name: true}},
            Cso: {select: {name: true}},
            Po: {select: {name: true}},
            Na: {select: {name: true}},
            skills: {
              include: {
                TrainingSkill: true
              }
            }
          }
        },
        teamMembers: {
          include: {
            member: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                skills: {
                  include: {
                    TrainingSkill: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const existingTeam = await this.findOne(id);
  
    const teamWithSameName = await this.prisma.team.findFirst({
      where: {
        name: UpdateTeamDto.name,
        id: { not: id }, 
      },
    });
  
    if (teamWithSameName) {
      throw new ConflictException('Team with the same data already exists.');
    }
  
    // Continue with the update logic
    const updatedTeam = await this.prisma.team.update({
      where: { id },
      data: { ...updateTeamDto },
    });

    const team = await this.findOne(updatedTeam.id)
    return team
  }
  
  async remove(id: string) {
    const existingTeam = await this.findOne(id);

    if (!existingTeam) {
        // Handle the case where the team with the given id doesn't exist
        return false;
    }

    // Should unable to delete if status is active
    if (existingTeam.status === TeamStatusEnum.Active) {
        return false;
    }

    await this.prisma.team.update({
        where: { id },
        data: {
            is_deleted: true,
        },
    });

    return true;
}

  async truncate() {
    return await this.prisma.team.deleteMany({});
  }

  async addMemberToTeam(teamMemberDto: TeamMemberDto){
    console.log('addMemberToTeam()', teamMemberDto)
    try {
      const added = await this.prisma.teamMember.create({
        data: { ...teamMemberDto },
      });

      const teamMember = await this.findOneTeamMember(added.id)
      return teamMember

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Team member with the same data already exists.');
      } else {
        throw new InternalServerErrorException('Failed to add Team Member.');
      }
    }
  }

  async findOneTeamMember(id: string){
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {id},
      include: {
        member: {
          include: {
            skills: {
              include: {
                TrainingSkill: true
              }
            }
          }
        }
      }
    })

    if (!teamMember) {
      throw new NotFoundException('Team member not found.');
    }

    return teamMember;
  }

  async removeMemberInTeam(id: string){
    const teamMember = this.prisma.teamMember.findUnique({
      where: {id}
    })

    if (!teamMember) {
      throw new NotFoundException('Team member not found.');
    }

    await this.prisma.teamMember.delete({
      where: { id },
    });

    return true

  }

}
