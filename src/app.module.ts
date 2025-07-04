import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from './invoices/invoices.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JobsModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
    InvoicesModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
