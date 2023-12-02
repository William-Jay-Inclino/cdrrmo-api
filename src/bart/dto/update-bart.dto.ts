import { PartialType } from '@nestjs/mapped-types';
import { CreateBartDto } from './create-bart.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBartDto extends PartialType(CreateBartDto) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
}
