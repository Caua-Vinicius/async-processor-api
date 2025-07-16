import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class ServiceBusService implements OnModuleDestroy {
  private readonly client: ServiceBusClient;
  constructor(@Inject('SERVICE_BUS_CLIENT') client: ServiceBusClient) {
    this.client = client;
  }

  async sendMessage(queueName: string, messagePayload: any): Promise<void> {
    const sender = this.client.createSender(queueName);
    try {
      const message: ServiceBusMessage = {
        body: messagePayload,
        contentType: 'application/json',
      };

      await sender.sendMessages(message);
    } catch (error) {
      throw error;
    } finally {
      await sender.close();
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
