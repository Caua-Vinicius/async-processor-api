import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from './invoices/invoices.module';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const keyVaultUrl = configService.get<string>('KEY_VAULT_URL');
        if (!keyVaultUrl) {
          throw new Error('KEY_VAULT_URL is not defined.');
        }

        const credential = new DefaultAzureCredential();
        const secretClient = new SecretClient(keyVaultUrl, credential);

        const secret = await secretClient.getSecret(
          'COSMOS-DB-CONNECTION-STRING',
        );

        return {
          uri: secret.value,
        };
      },
      inject: [ConfigService],
    }),
    JobsModule,
    InvoicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
