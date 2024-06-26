import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy, JwtStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { AbilityFactory } from './abilities/ability.factory';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10h' }, 
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AbilityFactory],
  exports: [AuthService, AbilityFactory],
})
export class AuthModule {}
