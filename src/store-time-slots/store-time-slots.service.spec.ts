import { Test, TestingModule } from '@nestjs/testing';
import { StoreTimeSlotsService } from './store-time-slots.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreTimeSlot } from './entities/store-time-slot.entity';
import { MockRepository } from '../../utils/MockRepository';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

describe('StoreTimeSlotsService', () => {
  let service: StoreTimeSlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreTimeSlotsService,
        StoreTimeSlotsService,
        UserService,
        {
          provide: getRepositoryToken(StoreTimeSlot),
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
        ConfigService,
      ],
    }).compile();

    service = module.get<StoreTimeSlotsService>(StoreTimeSlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
