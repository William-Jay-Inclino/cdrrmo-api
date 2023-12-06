import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingSkillDto } from './create-training-skill.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrainingSkillDto extends PartialType(CreateTrainingSkillDto) {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
}
