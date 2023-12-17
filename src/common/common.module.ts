import { Module } from '@nestjs/common';
import { FileController } from './file/file.controller';

@Module({
  providers: [],
  controllers: [FileController]
})
export class CommonModule {}
