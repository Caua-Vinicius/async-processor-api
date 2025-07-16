import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
