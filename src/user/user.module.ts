import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AbilityFactory } from 'src/auth/abilities/ability.factory';

@Module({
  controllers: [UserController],
  providers: [UserService, AbilityFactory],
  exports: [UserService]
})
export class UserModule {}
