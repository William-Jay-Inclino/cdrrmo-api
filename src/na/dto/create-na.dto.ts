import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateNaDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
}
