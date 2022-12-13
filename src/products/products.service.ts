import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IProduct,
  IProductDictionary,
  IStockError,
} from '@mamimomo/mamimomo-core';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product) repo,
    public readonly storageService: StorageService,
  ) {
    super(repo);
  }

  create(user: User, createProductDto: CreateProductDto) {
    if (createProductDto.image) {
      const product = {
        id: '',
        ...createProductDto,
        storeId: user.stores[0].id,
        image: null,
      };

      product.id = uuidv4();
      const publicSignedUrl = encodeURI(
        this.storageService.generatePublicSignedUrl(
          createProductDto.image.mime,
          `${product.id}.${createProductDto.image.ext}`,
          user.id,
        ),
      );
      const url = new URL(publicSignedUrl);

      product.image = url.origin + url.pathname;

      return {
        product: this.repo.save(product),
        uploadUrl: publicSignedUrl,
      };
    }

    const product = {
      ...createProductDto,
      storeId: user.stores[0].id,
      image: null,
    };
    return this.repo.save(product);
  }

  async findOneBy(id: string, by: Partial<Product>) {
    return await this.repo.findOne({
      where: {
        id,
        ...by,
      },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    productDb: Product,
    userId: string,
  ) {
    if (updateProductDto.image === null && productDb.image) {
      const url = new URL(productDb.image);
      await this.storageService.deleteImage(url.pathname.substring(1));
    }

    if (
      typeof updateProductDto.image !== 'string' &&
      updateProductDto.image?.mime
    ) {
      if (productDb.image) {
        // Delete if image already exist
        const url = new URL(productDb.image);
        await this.storageService.deleteImage(url.pathname.substring(1));
      }

      const uploadURL = encodeURI(
        this.storageService.generatePublicSignedUrl(
          updateProductDto.image.mime,
          `${productDb.id}.${updateProductDto.image.ext}`,
          userId,
        ),
      );

      const URLObject = new URL(uploadURL);
      const imageURL = URLObject.origin + URLObject.pathname;

      return {
        product: await this.repo.update(id, {
          ...updateProductDto,
          image: imageURL,
        }),
        uploadUrl: uploadURL,
      };
    }

    return await this.repo.update(id, {
      ...updateProductDto,
      image: updateProductDto.image === null ? null : productDb.image,
    });
  }

  async bulkUpdate(products: Product[]) {
    return await this.repo.save(products);
  }

  async remove(id: string, user: User, productDb: Product) {
    if (productDb.image) {
      const url = new URL(productDb.image);
      await this.storageService.deleteImage(url.pathname.substring(1));
    }

    return await this.repo
      .createQueryBuilder('product')
      .delete()
      .where('id = :id', { id })
      .andWhere('storeId = :storeId', { storeId: user.stores[0].id })
      .execute();
  }

  getProductDictionary(products: IProduct[]): IProductDictionary {
    const productDbDictionary: IProductDictionary = {};
    products.forEach((product) => {
      productDbDictionary[product.id] = product;
    });

    return productDbDictionary;
  }

  checkProductsAvailability(
    createOrderDto: CreateOrderDto,
    productsDbDictionary: IProductDictionary,
  ) {
    const payload: IStockError[] = [];
    createOrderDto.orderDetails.forEach((detail) => {
      // we do not handle error stock here, just publish status
      if (!productsDbDictionary[detail.productId].publish) {
        payload.push({
          id: detail.productId,
          max: productsDbDictionary[detail.productId].stock,
        });
      }
    });

    if (payload.length > 0) {
      throw new HttpException(
        {
          message: 'Product(s) unavailable',
          error: 'product-0001',
          payload,
        },
        200,
      );
    }
  }
}
