import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { MockRepository } from '../../utils/MockRepository';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
