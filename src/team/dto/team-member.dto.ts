import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class TeamMemberDto{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    team_id: string 
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    member_id: string 

}