import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatchDto } from './create-dispatch.dto';
import { IsUUID, IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

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
    
    @IsDate()
    time_dispatch?: Date            

    @IsDate()
    time_proceeding?: Date
    
    @IsDate()
    time_arrival?: Date            

    @IsDate()
    time_proceeding_hospital?: Date
    
    @IsDate()
    time_arrival_hospital?: Date
    
    @IsDate()
    time_back_to_base?: Date
    
    @IsDate()
    time_arrival_to_base?: Date
    
    @IsString()
    remarks: string          
    
    @IsNumber()
    status: number                   

}
