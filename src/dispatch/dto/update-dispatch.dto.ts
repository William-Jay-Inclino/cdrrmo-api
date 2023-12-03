import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatchDto } from './create-dispatch.dto';
import { IsUUID, IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDispatchDto extends PartialType(CreateDispatchDto) {
    @ApiProperty()
    @IsUUID()
    dispatcher_id: string

    @ApiProperty()
    @IsUUID()
    emergency_id: string

    @ApiProperty()
    @IsUUID()
    team_id: string                  

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    caller_name: string              
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    caller_number: string
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string
    
    @ApiProperty()
    @IsString()
    description: string     
    
    @ApiProperty()
    @IsNumber()
    num_people_involved: number
    
    @ApiProperty()
    @IsString()
    hazard: string           
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_of_call?: Date            

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_proceeding_scene?: Date
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_arrival_scene?: Date            

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_proceeding_hospital?: Date
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_arrival_hospital?: Date
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_proceeding_base?: Date
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_arrival_base?: Date
    
    @ApiProperty()
    @IsString()
    remarks: string          
    
    @ApiProperty()
    @IsNumber()
    status: number          
    
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    is_cancelled: boolean

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    is_completed: boolean

}
