import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatchDto } from './create-dispatch.dto';
import { IsUUID, IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDispatchDto extends PartialType(CreateDispatchDto) {
    @IsUUID()
    dispatcher_id: string

    @IsUUID()
    emergency_id: string
    
    @IsUUID()
    team_id: string                  

    @IsString()
    @IsNotEmpty()
    caller_name: string              
    
    @IsString()
    @IsNotEmpty()
    caller_number: string
    
    @IsString()
    @IsNotEmpty()
    location: string
    
    @IsString()
    description: string     
    
    @IsNumber()
    num_people_involved: number
    
    @IsString()
    hazard: string           
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_dispatch?: Date            

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_proceeding?: Date
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_arrival?: Date            

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_proceeding_hospital?: Date
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_arrival_hospital?: Date
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_back_to_base?: Date
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_arrival_to_base?: Date
    
    @IsString()
    remarks: string          
    
    @IsNumber()
    status: number                   

}
