import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Dispatch } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getDispatchesByDate(startDate: Date, endDate: Date) {
    const dispatches = await this.prisma.dispatch.findMany({
      where: {
        time_of_call: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        time_of_call: 'asc',
      },
      include: {
        dispatcher: true,
        emergency: true,
        team: true,
      },
    });

    // Generate a list of all dates within the range
    const allDates = this.getAllDatesWithinRange(startDate, endDate);

    // Organize the data by date, including dates without data
    const result = this.organizeDataByDate(dispatches, allDates);

    return result;
  }

  private organizeDataByDate(dispatches: Dispatch[], allDates) {
    const result = [];

    for (const dateKey of allDates) {
      const dataForDate = dispatches.filter(
        (dispatch) =>
          dispatch.time_of_call.toISOString().split('T')[0] === dateKey,
      );

      result.push({
        date: dateKey,
        data: dataForDate,
      });
    }

    return result;
  }

  private getAllDatesWithinRange(startDate: Date, endDate: Date) {
    const allDates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      allDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allDates;
  }
}
