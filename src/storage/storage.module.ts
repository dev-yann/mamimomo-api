import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [StorageController],
  providers: [StorageService, ConfigService],
  exports: [StorageService],
})
export class StorageModule {}
