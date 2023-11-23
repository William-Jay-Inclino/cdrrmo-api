import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    let createdDispatches: Dispatch[] = [];
  
    try {
      await this.prisma.$transaction(async (prismaClient) => {
        for (const createDispatchDto of createDispatchDtos) {
          const parsedTimeOfCall = new Date(createDispatchDto.time_of_call);
  
          // Ensure that the parsedTimeOfCall is a valid date
          if (isNaN(parsedTimeOfCall.getTime())) {
            throw new BadRequestException('Invalid date format for time_of_call');
          }
  
          const created = await prismaClient.dispatch.create({
            data: {
              ...createDispatchDto,
              time_of_call: parsedTimeOfCall,
            },
          });
  
          // Find the associated Team and update its status to 2
          await prismaClient.team.update({
            where: { id: createDispatchDto.team_id },
            data: { status: 2 },
          });
  
          createdDispatches.push(created);
        }
      });
  
      // Fetch the created dispatches after the transaction is committed
      createdDispatches = await Promise.all(
        createdDispatches.map(async (createdDispatch) => {
          return await this.findOne(createdDispatch.id);
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
        dispatcher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        emergency: true,
        team: {
          include: { // include team leader
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
              },
            },
            teamMembers: { // include team members
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
                  },
                }
              }
            }
          }
        }
      }
    });
  }

  async findOne(id: string) {

    console.log('Finding dispatch with ID:', id);
    
    const dispatch = await this.prisma.dispatch.findUnique({
      where: {id},
      include: {
        dispatcher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        emergency: true,
        team: { // include team leader
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
              },
            },
            teamMembers: { // include team members
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
      console.error('Prisma Error:', error);
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
