import { Controller, Get, Param } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('/api/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dispatches/byDate/:startDate/:endDate')
  async getDispatchesByDate(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const dispatches = await this.reportService.getDispatchesByDate(
      startDateTime,
      endDateTime,
    );

    return dispatches;
  }
}
