import {
  Controller,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Store } from './entities/store.entity';
import { Public } from '../decorators/public.decorator';
import { UserService } from '../user/user.service';

@Crud({
  model: {
    type: Store,
  },
  dto: {
    create: CreateStoreDto,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
  query: {
    join: {
      address: {},
      storeTimeSlots: {},
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@Controller('store')
export class StoreController implements CrudController<Store> {
  constructor(
    public service: StoreService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Override()
  getMany(
    @Query('lng') lng = 2.3488,
    @Query('lat') lat = 48.8534,
    @Query('radius') radius = 100,
    @Query('page') page = 1,
  ) {
    return this.service.findAll(lng, lat, radius, page);
  }

  @Override()
  @Public()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.service.getOne(req);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @Request() req,
  ) {
    const user = await this.userService.findOneWithRelation(req.user.id, [
      'stores',
    ]);
    if (!user || user.stores.filter((store) => store.id === id).length === 0) {
      throw new UnauthorizedException();
    }
    return this.service.update(updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateStoreDto) {
    const user = await this.userService.findOneWithRelation(req.user.id, [
      'stores',
    ]);

    if (!user || user.stores.length > 0) {
      throw new UnauthorizedException();
    }

    return await this.service.create(user.id, dto);
  }
}
