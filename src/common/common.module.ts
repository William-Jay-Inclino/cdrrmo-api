import { Module } from '@nestjs/common';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';

@Module({
  providers: [FileService],
  controllers: [FileController]
})
export class CommonModule {}
