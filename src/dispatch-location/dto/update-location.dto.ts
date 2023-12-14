import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
