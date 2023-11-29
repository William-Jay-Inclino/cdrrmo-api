import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/ping')
  async ping(){
    return 'pong'
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    console.log('AuthController: login()')
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  getProfile() {
    return 'ok'
  }

}
