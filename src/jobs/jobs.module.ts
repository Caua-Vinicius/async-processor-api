import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './jobs.schema';
import { ServiceBusModule } from 'src/service-bus/servicebus.module';
import { AzureBlobModule } from 'src/azure-blob/azure-blob.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Job.name,
        useFactory: () => {
          const schema = JobSchema;
          return schema;
        },
      },
    ]),
    ServiceBusModule,
    AzureBlobModule,
  ],
  controllers: [JobsController],
  providers: [
    {
      provide: 'QUEUE_NAME',
      useFactory: (configService: ConfigService) => {
        const queueName = configService.get<string>('QUEUE_NAME');
        if (!queueName) {
          throw new Error('Queue Name was not configured');
        }
        return queueName;
      },
      inject: [ConfigService],
    },
    JobsService,
  ],
  exports: [JobsService],
})
export class JobsModule {}
