import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemCategoryDto } from './create-item-category.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateItemCategoryDto extends PartialType(CreateItemCategoryDto) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
