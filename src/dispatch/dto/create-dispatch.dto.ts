import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNotEmpty, IsString, IsUUID, IsNumber, IsDate } from "class-validator"

export class CreateDispatchDto {

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
    @IsString()
    remarks: string  
    
    @ApiProperty()
    @IsNumber()
    status: number         
    
    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    time_of_call: Date

}
