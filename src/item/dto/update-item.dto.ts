import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsUUID, IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateItemDto extends PartialType(CreateItemDto) {
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
    @IsString()
    serial_number: string

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
