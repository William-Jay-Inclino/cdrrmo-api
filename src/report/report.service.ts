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
      // const dataForDate = dispatches.filter(
      //   (dispatch) =>
      //     dispatch.time_of_call.toISOString().split('T')[0] === dateKey,
      // );

      const dataForDate = dispatches.filter(
        (dispatch) => {
          const timeOfCall = new Date(dispatch.time_of_call);
          return timeOfCall.toISOString().split('T')[0] === dateKey;
        },
      );

      const dataForDate_formatted_dateTime = this.formatDateTime(dataForDate)

      result.push({
        date: dateKey,
        // data: dataForDate,
        data: dataForDate_formatted_dateTime,
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

  private formatDateTime(dispatches: Dispatch[]): Dispatch[] {

    console.log('formatDateTime()');

    return dispatches.map(item => {
      
      // @ts-ignore
      item.time_of_call = item.time_of_call ? this.formatDate(new Date(item.time_of_call)) : null
      // @ts-ignore
      item.time_of_call2 = item.time_of_call ? this.formatTime(new Date(item.time_of_call)) : null
      // @ts-ignore
      item.time_proceeding_scene = item.time_proceeding_scene ?  this.formatDate(new Date(item.time_proceeding_scene)) : null
      // @ts-ignore
      item.time_arrival_scene = item.time_arrival_scene ? this.formatDate(new Date(item.time_arrival_scene)) : null
      // @ts-ignore
      item.time_proceeding_hospital = item.time_proceeding_hospital ? this.formatDate(new Date(item.time_proceeding_hospital)) : null
      // @ts-ignore
      item.time_arrival_hospital = item.time_arrival_hospital ? this.formatDate(new Date(item.time_arrival_hospital)) : null
      // @ts-ignore
      item.time_proceeding_base = item.time_proceeding_base ? this.formatDate(new Date(item.time_proceeding_base)) : null
      // @ts-ignore
      item.time_arrival_base = item.time_arrival_base ? this.formatDate(new Date(item.time_arrival_base)) : null
      // @ts-ignore
      item.created_at =  this.formatDate(new Date(item.created_at))

      return item
    })

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

  private formatTime(date: Date): string {
    // Get hours and minutes from the date object
    let hours: number = date.getHours();
    let minutes: number = date.getMinutes();
  
    // Determine AM or PM
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
  
    // Convert hours from 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  
    // Pad minutes with leading zero if needed
    const minutesStr: string = minutes < 10 ? '0' + minutes : minutes.toString();
  
    // Combine the parts into the final format
    const formattedTime: string = `${hours}:${minutesStr} ${ampm}`;
    
    return formattedTime;
  }

}
