import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';

@Injectable()
export class AzureBlobService {
  constructor(
    @Inject('BLOB_SERVICE_CLIENT')
    private readonly blobServiceClient: BlobServiceClient,
    @Inject('AZURE_STORAGE_CONTAINER_NAME')
    private readonly containerName: string,
  ) {}
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
