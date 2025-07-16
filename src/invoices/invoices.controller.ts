import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateJobPayloadDto } from 'src/jobs/dtos/create-job.dto';
import { JobsService } from 'src/jobs/jobs.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(202)
  async createInvoice(@Body() createInvoiceDto: CreateJobPayloadDto) {
    const job = await this.jobsService.create(createInvoiceDto);
    return {
      jobId: job.id,
      statusUrl: `/jobs/${job.id}/status`,
    };
  }
}
