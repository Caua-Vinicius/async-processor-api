import { Controller, Get, Param, Res } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './jobs.schema';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { Response } from 'express';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  @Get(':id')
  async getJobById(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<Job> {
    return this.jobsService.fetchJobById(id);
  }

  @Get(':id/status')
  async getJobStatus(@Param('id', ValidateObjectIdPipe) id: string) {
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

  @Get(':id/result')
  async getJobResult(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Res() res: Response,
  ) {
    const job = await this.getJobById(id);

    if (!job.result?.blobUrl) {
      return res.status(404).json({
        message: 'No result available for this job.',
      });
    }

    const blobName = `invoice-${job.id}.pdf`;

    try {
      const { stream, length, type } =
        await this.azureBlobService.getBlobStream(blobName);

      res.setHeader('Content-Type', type);
      res.setHeader('Content-Length', length);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${blobName}"`,
      );

      // Set cache control headers to allow caching for 1 day
      res.setHeader('Cache-Control', 'public, max-age=86400');

      stream.pipe(res);
    } catch (error) {
      res.status(error.status || 500).send({
        statusCode: error.status || 500,
        message: error.message,
      });
    }
  }
}
