import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Dispatch, User } from '@prisma/client';
import { DispatchStatusEnum } from './entities';
import { TeamStatusEnum } from 'src/team/entities/team.enum';
import { UserLevelEnum } from 'src/user/entities';

@Injectable()
export class DispatchService {

  constructor(private readonly prisma: PrismaService) {
    console.log('=== DispatchService ===')
  }


  // this accepts single or multiple dispatch
  async create(createDispatchDtos: CreateDispatchDto[]): Promise<{ is_success: boolean, data: Dispatch[], msg: string }> {
    let createdDispatches: Dispatch[] = [];

    let canCreate = true

    for (let x of createDispatchDtos) {
      canCreate = await this.isTeamActive(x.team_id)
      if (!canCreate) {
        break
      }
    }

    if (!canCreate) {
      return {
        is_success: false,
        data: [],
        msg: 'Selected team(s) are already dispatched'
      }
    }

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
          const dispatch = await this.findOne(createdDispatch.id);
          // @ts-ignore
          dispatch.time_of_call = this.formatDate(dispatch.time_of_call)
          return dispatch
        }),
      );

      return {
        is_success: true,
        data: createdDispatches,
        msg: 'Teams dispatched successfully'
      }
    } catch (error) {
      console.error('Prisma Error:', error);
      throw new InternalServerErrorException('Failed to create Dispatch.');
    }
  }

  async isTeamActive(teamId: string): Promise<boolean> {
    const team = await this.prisma.team.findUnique({
      select: {
        id: true,
        status: true,
      },
      where: {
        id: teamId
      }
    })

    if (team.status === TeamStatusEnum.Active) {
      return true
    }

    return false

  }

  // this will get all dispatched records today or records that are not completed

  async findAll(payload: { currentUser: User }): Promise<Dispatch[]> {
    console.log('currentUser', payload.currentUser)
    const today = new Date();
    today.setUTCHours(8, 0, 0, 0);

    const query = {
      where: {
        OR: [
          {
            created_at: {
              gte: today,
            },
          },
          {
            is_completed: false,
          },
        ],
      },
      include: {
        dispatcher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        emergency: true,
        team: {
          include: {
            team_leader: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                type: true,
                Bart: { select: { name: true } },
                Cso: { select: { name: true } },
                Po: { select: { name: true } },
                Na: { select: { name: true } },
                skills: {
                  include: {
                    TrainingSkill: true,
                  },
                },
              },
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
                        TrainingSkill: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    // Check if the currentUser is an admin
    if (payload.currentUser.user_level === UserLevelEnum.Admin) {
      const dispatches = await this.prisma.dispatch.findMany(query);
      console.log('dispatches', dispatches)
      return dispatches.map(i => {
        // @ts-ignore
        i.time_of_call = this.formatDate(i.time_of_call)
        return i
      })
    }

    // If not admin, add additional filtering for dispatcher_id
    query.where['dispatcher_id'] = payload.currentUser.id;

    const dispatches = await this.prisma.dispatch.findMany(query);

    return dispatches.map(i => {
      // @ts-ignore
      i.time_of_call = this.formatDate(i.time_of_call)
      return i
    })
  }

  async findOne(id: string) {

    console.log('Finding dispatch with ID:', id);

    const dispatch = await this.prisma.dispatch.findUnique({
      where: { id },
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
                type: true,
                Bart: { select: { name: true } },
                Cso: { select: { name: true } },
                Po: { select: { name: true } },
                Na: { select: { name: true } },
                skills: {
                  include: {
                    TrainingSkill: true,
                  },
                },
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

    console.log('updateDispatchDto', updateDispatchDto)
    let updatedDispatch: Dispatch | null = null;

    // Check if the dispatch with the given ID exists
    const existingDispatch = await this.findOne(id);

    try {
      await this.prisma.$transaction(async (prismaClient) => {
        // Update the dispatch within the transaction
        updatedDispatch = await prismaClient.dispatch.update({
          where: { id },
          data: updateDispatchDto,
        });

        // Check if status is ArrivedBase
        if (updateDispatchDto.status && updateDispatchDto.status === DispatchStatusEnum.ArrivedBase) {
          await prismaClient.team.update({
            where: { id: updatedDispatch.team_id },
            data: { status: TeamStatusEnum.Active },
          });
        }
      });

      // Fetch the updated dispatch after the transaction is committed
      if (updatedDispatch) {
        updatedDispatch = await this.findOne(updatedDispatch.id);
      }

      // @ts-ignore
      updatedDispatch.time_of_call = this.formatDate(updatedDispatch.time_of_call)

      return updatedDispatch;
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

    // update all teams to active status as well
    const updatedTeams = await this.prisma.team.updateMany({
      where: {}, // Empty where clause matches all records
      data: { status: 1 },
    });

    return await this.prisma.dispatch.deleteMany({});
  }

  async updateTimeField(dispatchId: string, fieldName: string, updateDispatchDto: UpdateDispatchDto): Promise<Dispatch> {
    const allowedFields = [
      'time_proceeding_scene',
      'time_arrival_scene',
      'time_proceeding_hospital',
      'time_arrival_hospital',
      'time_proceeding_base',
      'time_arrival_base',
    ];

    if (!allowedFields.includes(fieldName)) {
      throw new Error(`Field ${fieldName} is not allowed for time update.`);
    }

    const updateData: Record<string, any> = {}

    updateData[fieldName] = new Date(); // Set to the current date and time

    // Check if the dispatch with the given ID exists
    const existingDispatch = await this.findOne(dispatchId);

    if (existingDispatch.dispatcher_id !== updateDispatchDto.dispatcher_id) {
      throw new Error(`Dispatcher not allowed to set time`);
    }

    // Update status based on the fieldName
    switch (fieldName) {
      case 'time_proceeding_scene':
        updateData['status'] = 2;
        break;
      case 'time_arrival_scene':
        updateData['status'] = 3;
        break;
      case 'time_proceeding_hospital':
        updateData['status'] = 4;
        break;
      case 'time_arrival_hospital':
        updateData['status'] = 5;
        break;
      case 'time_proceeding_base':
        updateData['status'] = 6;
        break;
      case 'time_arrival_base':
        updateData['status'] = 7;
        break;
      default:
        break;
    }

    let updatedDispatch: Dispatch;

    try {
      await this.prisma.$transaction(async (prismaClient) => {
        updatedDispatch = await prismaClient.dispatch.update({
          where: { id: dispatchId },
          data: updateData,
        });

        if (updateData['status'] === DispatchStatusEnum.ArrivedBase) {
          await prismaClient.team.update({
            where: { id: updatedDispatch.team_id },
            data: {
              status: TeamStatusEnum.Active,
            },
          });
        }
      });
    } catch (error) {
      console.error('Prisma Error:', error);
      throw new InternalServerErrorException('Failed to update Dispatch.');
    }

    const dispatch = await this.findOne(updatedDispatch.id);
    // @ts-ignore
    dispatch.time_of_call = this.formatDate(dispatch.time_of_call)

    return dispatch
  }

  private formatDate(date: Date) {
    return (
      [
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
        date.getFullYear() % 100,
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

}
