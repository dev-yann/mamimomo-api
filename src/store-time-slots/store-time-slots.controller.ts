import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { StoreTimeSlotsService } from './store-time-slots.service';
import { CreateStoreTimeSlotDto } from './dto/create-store-time-slot.dto';
import { UserService } from '../user/user.service';
import { Public } from '../decorators/public.decorator';

@Controller('store-time-slots')
export class StoreTimeSlotsController {
  constructor(
    private readonly storeTimeSlotsService: StoreTimeSlotsService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createStoreTimeSlotDto: CreateStoreTimeSlotDto,
  ) {
    const user = await this.userService.findOneWithRelation(req.user.id, [
      'stores',
    ]);

    if (!user || !user.stores) {
      throw new UnauthorizedException();
    }

    await this.storeTimeSlotsService.removeAll(createStoreTimeSlotDto.store);

    return this.storeTimeSlotsService.create(createStoreTimeSlotDto);
  }

  @Get(':id')
  @Public()
  findByStore(@Param('id') id: string) {
    return this.storeTimeSlotsService.findByStore(id);
  }
}
