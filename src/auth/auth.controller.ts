import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalProAuthGuard } from './guards/local-pro-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @Public()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalProAuthGuard)
  @Post('auth/login/pro')
  @Public()
  async loginPro(@Request() req) {
    return this.authService.login(req.user);
  }
}
