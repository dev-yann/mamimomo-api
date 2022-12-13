import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user || user.organizationId) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async validateUserPro(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !user.organizationId) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
