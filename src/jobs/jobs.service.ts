import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './jobs.schema';
import { Model } from 'mongoose';
import { CreateJobPayloadDto } from './dtos/create-job.dto';
import { ConfigService } from '@nestjs/config';
import { ServiceBusService } from 'src/service-bus/servicebus.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel('Job') private jobModel: Model<Job>,
    private readonly configService: ConfigService,
    private readonly serviceBusService: ServiceBusService,
  ) {}

  async create(createjobPayloadDto: CreateJobPayloadDto): Promise<Job> {
    const newJob = new this.jobModel({
      inputData: createjobPayloadDto,
    });

    const queueName = this.configService.get<string>('QUEUE_NAME');
    const message = {
      jobId: newJob._id,
      inputData: newJob.inputData,
    };

    await this.serviceBusService.sendMessage(queueName, message);

    return newJob.save();
  }

  async fetchJobById(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();

    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);

    return job;
  }
}
