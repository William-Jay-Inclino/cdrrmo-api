import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { SearchFieldEnum } from '../entities';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    page: number;
    
    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    pageSize: number;

    @ApiProperty({
        required: false, // Set required to false for optional fields
        enum: SearchFieldEnum,
    })
    @IsOptional()
    @IsEnum(SearchFieldEnum)
    searchField?: SearchFieldEnum;

    @ApiProperty({
        required: false, // Set required to false for optional fields
        type: String, // Specify the type explicitly
    })
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => String(value))
    @IsString()
    searchValue?: string;
}
