import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"


export class UserSkillDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    training_skill_id: string 
}