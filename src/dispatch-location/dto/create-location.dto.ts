import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
