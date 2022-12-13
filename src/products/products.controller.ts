import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../decorators/public.decorator';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
  Override,
} from '@nestjsx/crud';
import { Product } from './entities/product.entity';
import { UserService } from '../user/user.service';
import { StoreService } from '../store/store.service';

@Crud({
  model: {
    type: Product,
  },
  routes: {
    only: ['getManyBase', 'deleteOneBase'],
  },
  query: {
    filter: (search, getMany) => {
      return {
        ...search,
        ...(getMany ? { publish: true } : {}), // Force to get publish product for public
      };
    },
  },
})
@Controller('products')
export class ProductsController implements CrudController<Product> {
  constructor(
    public readonly service: ProductsService,
    public readonly userService: UserService,
    public readonly storeService: StoreService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createProductDto: CreateProductDto) {
    const user = await this.userService.findOneWithRelation(req.user.id, [
      'stores',
    ]);
    if (!user || user.stores.length === 0) {
      return new UnauthorizedException();
    }
    return this.service.create(user, createProductDto);
  }

  @Override()
  @UseInterceptors(CrudRequestInterceptor)
  @Public()
  async getMany(
    @ParsedRequest() req: CrudRequest,
    @Query('store') storeId: string,
    @Request() request,
  ) {
    if (!storeId) {
      return new UnauthorizedException();
    }

    const store = await this.storeService.findOne(storeId);
    if (!store || !store.publish) {
      // Store need to be publish for public
      return new UnauthorizedException();
    }

    return this.service.getMany(req);
  }

  @Get('/pro')
  @UseInterceptors(CrudRequestInterceptor)
  async getManyOwnProducts(
    @ParsedRequest() req: CrudRequest,
    @Query('store') storeId: string,
    @Request() request,
  ) {
    if (!storeId) {
      return new UnauthorizedException();
    }

    const store = await this.storeService.findOne(storeId);
    if (request.user.id !== store.userId) {
      return new UnauthorizedException();
    }

    return this.service.getMany(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const store = await this.storeService.findOne(updateProductDto.storeId);
    if (req.user.id !== store.userId) {
      return new UnauthorizedException();
    }

    const product = await this.service.findOneBy(id, {
      storeId: updateProductDto.storeId,
    });

    if (!product) {
      throw new UnauthorizedException();
    }
    return this.service.update(id, updateProductDto, product, req.user.id);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const user = await this.userService.findOneWithRelation(req.user.id, [
      'stores',
    ]);
    if (user.stores.length === 0) {
      throw new UnauthorizedException();
    }

    const product = await this.service.findOneBy(id, {
      storeId: user.stores[0].id,
    });

    if (!product) {
      throw new UnauthorizedException();
    }

    return await this.service.remove(id, user, product);
  }
}
