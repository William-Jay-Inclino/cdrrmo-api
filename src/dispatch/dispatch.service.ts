import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Dispatch } from '@prisma/client';

@Injectable()
export class DispatchService {

  constructor(private readonly prisma: PrismaService) {
    console.log('=== DispatchService ===')
  }


  // this accepts single or multiple dispatch
  async create(createDispatchDtos: CreateDispatchDto[]): Promise<Dispatch[]> {

    console.log('create()', createDispatchDtos)
    try {
      const createdDispatches = await Promise.all(
        createDispatchDtos.map(async (createDispatchDto) => {
          const created = await this.prisma.dispatch.create({
            data: { ...createDispatchDto },
          });

          return await this.findOne(created.id);
        }),
      );

      return createdDispatches;
    } catch (error) {
      console.error('Prisma Error:', error);
      throw new InternalServerErrorException('Failed to create Dispatch.');
    }
  }

  async findAll() {
    return await this.prisma.dispatch.findMany({
      include: {
        dispatcher: true,
        emergency: true,
        team: {
          include: { // include team leader
            team_leader: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
              include: {
                skills: {
                  include: {
                    TrainingSkill: true
                  }
                }
              }
            },
            teamMembers: { // include team members
              include: {
                member: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                  include: {
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
        }
      }
    });
  }

  findOne(id: string) {
    
    const dispatch = this.prisma.dispatch.findUnique({
      where: {id},
      include: {
        dispatcher: true,
        emergency: true,
        team: { // include team leader
          include: { 
            team_leader: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
              include: {
                skills: {
                  include: {
                    TrainingSkill: true
                  }
                }
              }
            },
            teamMembers: { // include team members
              include: {
                member: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                  include: {
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
        }
      }
    })

    if (!dispatch) {
      throw new NotFoundException('Dispatch not found.');
    }

    return dispatch;

  }

  async update(id: string, updateDispatchDto: UpdateDispatchDto): Promise<Dispatch | null> {
    try {
      // Check if the dispatch with the given ID exists
      const existingDispatch = await this.findOne(id);

      // Update the dispatch
      const updatedDispatch = await this.prisma.dispatch.update({
        where: { id },
        data: updateDispatchDto,
      });

      return await this.findOne(updatedDispatch.id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update Dispatch.');
    }
  }

  async remove(id: string) {
    const existingDispatch = await this.findOne(id);
  
    await this.prisma.dispatch.delete({
      where: { id },
    });

    console.log('remove success')
  
    return true;
  }

  async truncate() {
    return await this.prisma.dispatch.deleteMany({});
  }

}
