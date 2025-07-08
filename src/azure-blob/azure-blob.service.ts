import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { Readable } from 'stream';

@Injectable()
export class AzureBlobService {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerName: string;

  constructor(private configService: ConfigService) {
    const accountName = this.configService.get<string>(
      'AZURE_STORAGE_ACCOUNT_NAME',
    );
    if (!accountName) {
      throw new InternalServerErrorException(
        'Azure Storage Account Name was not configured',
      );
    }

    const blobServiceUrl = `https://${accountName}.blob.core.windows.net`;

    const credential = new DefaultAzureCredential();

    this.blobServiceClient = new BlobServiceClient(blobServiceUrl, credential);

    this.containerName = this.configService.get<string>(
      'AZURE_STORAGE_CONTAINER_NAME',
    );

    if (!this.containerName) {
      throw new InternalServerErrorException(
        'Azure Storage Container Name was not configured',
      );
    }
  }

  private getBlockBlobClient(blobName: string): BlockBlobClient {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    return containerClient.getBlockBlobClient(blobName);
  }

  async getBlobStream(
    blobName: string,
  ): Promise<{ stream: Readable; length: number; type: string }> {
    const blockBlobClient = this.getBlockBlobClient(blobName);

    try {
      const blobExists = await blockBlobClient.exists();
      if (!blobExists) {
        throw new NotFoundException(`Blob "${blobName}" not found.`);
      }

      const properties = await blockBlobClient.getProperties();
      const response = await blockBlobClient.download(0);

      return {
        stream: response.readableStreamBody as Readable,
        length: properties.contentLength,
        type: properties.contentType,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Was not possible to get the blob stream',
      );
    }
  }
}
