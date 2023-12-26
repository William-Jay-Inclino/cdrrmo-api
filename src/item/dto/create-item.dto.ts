import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
    @ApiProperty()
    @IsUUID()
    category_id: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    cost: number

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date_acquired: Date
}
