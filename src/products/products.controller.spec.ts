import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '../../utils/MockRepository';
import { Product } from './entities/product.entity';
import { StoreService } from '../store/store.service';
import { UserService } from '../user/user.service';
import { Store } from '../store/entities/store.entity';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: new MockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(),
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: new MockRepository(),
        },
        {
          provide: getRepositoryToken(Store),
          useValue: new MockRepository(),
        },
        ConfigService,
        StoreService,
        UserService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
