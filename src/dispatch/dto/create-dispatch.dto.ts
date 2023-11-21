import { IsNotEmpty, IsString, IsUUID, IsNumber, IsDate } from "class-validator"

export class CreateDispatchDto {

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
    
    @IsString()
    remarks: string  
    
    @IsNumber()
    status: number                   

}
