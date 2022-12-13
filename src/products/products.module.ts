import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Store } from '../store/entities/store.entity';
import { UserModule } from '../user/user.module';
import { StoreService } from '../store/store.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Store]),
    UserModule,
    StorageModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, StoreService],
  exports: [ProductsService],
})
export class ProductsModule {}
