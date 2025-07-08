import { Global, Module } from '@nestjs/common';
import { ServiceBusService } from './servicebus.service';
import { ConfigService } from '@nestjs/config';
import { ServiceBusClient } from '@azure/service-bus';
import { DefaultAzureCredential } from '@azure/identity';

@Global()
@Module({
  providers: [
    {
      provide: 'SERVICE_BUS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const fullyQualifiedNamespace = configService.get<string>(
          'SERVICE_BUS_FULLY_QUALIFIED_NAMESPACE',
        );

        if (!fullyQualifiedNamespace) {
          throw new Error(
            'SERVICE_BUS_FULLY_QUALIFIED_NAMESPACE it is not defined.',
          );
        }

        const credential = new DefaultAzureCredential();

        return new ServiceBusClient(fullyQualifiedNamespace, credential);
      },
      inject: [ConfigService],
    },
    ServiceBusService,
  ],
  exports: [ServiceBusService],
})
export class ServiceBusModule {}
