import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsUUID, IsString, IsNumber} from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
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
    cost: number
}
