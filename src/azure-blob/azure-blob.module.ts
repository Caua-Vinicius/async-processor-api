import { Module } from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

@Module({
  providers: [
    {
      provide: 'BLOB_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const accountName = configService.get<string>(
          'AZURE_STORAGE_ACCOUNT_NAME',
        );
        if (!accountName) {
          throw new Error('Azure Storage Account Name was not configured');
        }

        const blobServiceUrl = `https://${accountName}.blob.core.windows.net`;
        const credential = new DefaultAzureCredential();

        return new BlobServiceClient(blobServiceUrl, credential);
      },
      inject: [ConfigService],
    },
    {
      provide: 'AZURE_STORAGE_CONTAINER_NAME',
      useFactory: (configService: ConfigService) => {
        const containerName = configService.get<string>(
          'AZURE_STORAGE_CONTAINER_NAME',
        );
        if (!containerName) {
          throw new Error('Azure Storage Container Name was not configured');
        }
        return containerName;
      },
      inject: [ConfigService],
    },
    AzureBlobService,
  ],
  exports: [AzureBlobService],
})
export class AzureBlobModule {}
