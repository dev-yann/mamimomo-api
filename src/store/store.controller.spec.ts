import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { MockRepository } from '../../utils/MockRepository';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

describe('StoreController', () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: new MockRepository(),
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(),
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: new MockRepository(),
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
