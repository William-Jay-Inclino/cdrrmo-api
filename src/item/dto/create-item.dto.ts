import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
    @ApiProperty()
    @IsUUID()
    category_id: string
    
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    description: string

    @ApiProperty()
    @IsNumber()
    quantity: number

    @ApiProperty()
    @IsNumber()
    cost: number

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date_acquired: Date


    @ApiProperty()
    @IsString()
    serial_number: string
}
