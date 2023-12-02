import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { SearchFieldEnum } from '../entities';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class SearchQueryDto {
    @IsInt()
    @Type(() => Number)
    page: number;
  
    @IsInt()
    @Type(() => Number)
    pageSize: number;

    @IsOptional()
    @IsEnum(SearchFieldEnum)
    searchField: SearchFieldEnum;

    @IsOptional()
    @Transform(({ value }: TransformFnParams) => String(value))
    @IsString()
    searchValue?: string;
}
