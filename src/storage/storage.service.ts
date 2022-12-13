import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class StorageService {
  private scw;
  constructor(private configService: ConfigService) {
    this.scw = new S3({
      endpoint: this.configService.get('BUCKET_ENDPOINT'),
      region: this.configService.get('BUCKET_REGION'),
      accessKeyId: this.configService.get('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('ACCESS_KEY_SECRET'),
      signatureVersion: 'v4',
      params: { Bucket: this.configService.get('BUCKET_NAME') },
    });
  }

  generateSignedUrl(contentType: string, name: string, userId: string) {
    return this.scw.getSignedUrl('putObject', {
      Key: `tmp/${userId}/${Date.now()}-${name}`,
      ContentType: contentType,
      Expires: 300,
      //ACL: 'public-read',
    });
  }

  generatePublicSignedUrl(contentType: string, name: string, userId: string) {
    return this.scw.getSignedUrl('putObject', {
      Key: `public/${userId}/${name}`,
      ContentType: contentType,
      ACL: 'public-read',
    });
  }

  async deleteImage(key: string) {
    console.log('deleteImage !!');
    try {
      return await this.scw.deleteObject({ Key: key }, (err, data) => {
        console.log('error ! ', err);
        console.log('data ! ', data);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
