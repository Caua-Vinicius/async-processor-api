import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum JobStatus {
  QUEUED = 'Queued',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

@Schema({
  collection: 'Jobs',
  timestamps: true,
})
export class Job extends Document {
  @Prop({
    type: String,
    enum: JobStatus,
    required: true,
    default: JobStatus.QUEUED,
  })
  status: JobStatus;

  @Prop({ type: Object, required: true })
  inputData: {
    customerName: string;
    customerEmail: string;
    items: {
      description: string;
      amount: number;
    }[];
  };

  @Prop({ type: Object, required: false })
  result?: {
    blobUrl: string;
    fileSize: number;
  };

  @Prop({ type: String, required: false })
  errorDetails?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
