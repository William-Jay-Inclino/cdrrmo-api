import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileService } from '../common/file/file.service';

@Module({
  controllers: [UserController],
  providers: [UserService, FileService],
  exports: [UserService]
})
export class UserModule {}
