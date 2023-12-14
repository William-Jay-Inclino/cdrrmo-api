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

    @ApiProperty()
    @IsOptional()
    @IsEnum(SearchFieldEnum)
    searchField?: SearchFieldEnum;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => String(value))
    @IsString()
    searchValue?: string;
}
