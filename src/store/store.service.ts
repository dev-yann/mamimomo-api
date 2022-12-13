import { HttpException, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { IStore } from '@mamimomo/mamimomo-core';

@Injectable()
export class StoreService extends TypeOrmCrudService<Store> {
  constructor(@InjectRepository(Store) repo) {
    super(repo);
  }

  async create(userId: string, createStoreDto: CreateStoreDto) {
    const store = {
      ...createStoreDto,
      userId,
    };
    return await this.repo.save(store);
  }

  findAll(lon: number, lat: number, radius: number, page: number) {
    return this.repo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.address', 'address')
      .skip((page - 1) * 20)
      .take(20)
      .where(
        `ST_Distance_Sphere(coordinates, ST_MakePoint(:lon,:lat)) <= :radius * 1000`,
      )
      .andWhere('store.publish = :publish', { publish: true })
      .setParameters({
        // stringify GeoJSON
        lon,
        lat,
        radius,
      })
      .getMany();
  }

  async update(updateStoreDto: UpdateStoreDto) {
    return await this.repo.save(updateStoreDto);
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  checkStoreAvailability(store: IStore): void {
    if (!store.publish) {
      throw new HttpException(
        {
          message: 'Store unavailable',
          error: 'store-0001',
          payload: { id: store.id },
        },
        200,
      );
    }
  }

  async getStoreWithProducerAndProducts(
    storeId: string,
    productIds: string[],
  ): Promise<Store> {
    return await this.repo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.user', 'user')
      .leftJoinAndSelect(
        'store.products',
        'product',
        'product.id IN(:...ids)',
        { ids: productIds },
      )
      .where('store.id = :id', { id: storeId })
      .getOne();
  }
}
