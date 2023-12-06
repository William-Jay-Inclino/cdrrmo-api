import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { TeamStatusEnum } from '../entities';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    team_leader_id: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 255) 
    name: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TeamStatusEnum)
    status: TeamStatusEnum;

}
