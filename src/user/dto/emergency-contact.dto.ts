import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"


export class EmergencyContactDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string 

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    relationship: string 

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    mobile: string
}