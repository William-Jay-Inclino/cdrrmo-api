import { IsEnum } from "class-validator";
import { TableEnum } from "../entities";
import { ApiProperty } from "@nestjs/swagger";


export class TableSeederDto {
    @ApiProperty()
    @IsEnum(TableEnum)
    tbl_name: TableEnum;
}