import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './jobs.schema';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':id')
  async getJobById(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<Job> {
    return this.jobsService.fetchJobById(id);
  }

  @Get(':id/status')
  async getJobStatus(@Param('id') id: string) {
    const job = await this.getJobById(id);

    return {
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,

      ...(job.result?.blobUrl && { resultUrl: `/jobs/${job.id}/result` }),

      ...(job.errorDetails && { error: job.errorDetails }),
    };
  }
}
