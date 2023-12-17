import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"


export class UserSkillDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    training_skill_id: string 


    @ApiProperty()
    @IsOptional()
    @IsString()
    image_url?: string;
}