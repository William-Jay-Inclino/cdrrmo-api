import { PartialType } from '@nestjs/mapped-types';
import { CreateNaDto } from './create-na.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNaDto extends PartialType(CreateNaDto) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
}
