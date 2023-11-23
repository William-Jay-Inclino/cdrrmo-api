import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from '@prisma/client';
import { TeamMemberDto } from './dto';

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

  async findAll() {
    return await this.prisma.team.findMany({
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

  async findAllActive(status: number) {
    return await this.prisma.team.findMany({
      where: {status},
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
  
    await this.prisma.team.delete({
      where: { id },
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
