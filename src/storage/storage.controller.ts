import { Body, Controller, Post, Request } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UserService } from '../user/user.service';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  @Post('url')
  generateSignedUrl(
    @Request() req,
    @Body('mime') mime: string,
    @Body('name') name: string,
  ) {
    return {
      uploadUrl: encodeURI(
        this.storageService.generateSignedUrl(mime, name, req.user.id),
      ),
    };
  }

  @Post('url/public/store')
  async generateSignedUrlStoreImage(
    @Request() req,
    @Body('mime') mime: string,
    @Body('name') name: string,
  ) {
    const user = await this.userService.findOneWithRelation(req.user.id, [
      'stores',
    ]);

    if (user.stores[0].image) {
      // Delete if image already exist
      const url = new URL(user.stores[0].image);
      await this.storageService.deleteImage(url.pathname.substring(1));
    }

    return {
      uploadUrl: encodeURI(
        this.storageService.generatePublicSignedUrl(
          mime,
          `${user.stores[0].id}-${name}`,
          req.user.id,
        ),
      ),
    };
  }
}
