import { Global, Module } from '@nestjs/common';
import { ServiceBusService } from './servicebus.service';
import { ConfigService } from '@nestjs/config';
import { ServiceBusClient } from '@azure/service-bus';

@Global()
@Module({
  providers: [
    {
      provide: 'SERVICE_BUS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>(
          'SERVICE_BUS_CONNECTION_STRING',
        );
        if (!connectionString) {
          throw new Error('SERVICE_BUS_CONNECTION_STRING it is not defined.');
        }
        return new ServiceBusClient(connectionString);
      },
      inject: [ConfigService],
    },
    ServiceBusService,
  ],
  exports: [ServiceBusService],
})
export class ServiceBusModule {}
