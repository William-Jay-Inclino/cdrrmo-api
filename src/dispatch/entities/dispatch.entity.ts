import { User } from "src/user/entities"
import { DispatchStatusEnum } from "."
import { Emergency } from "src/emergency/entities"
import { Team } from "src/team/entities"

export class Dispatch{
    id: string 
    dispatcher_id: string 
    emergency_id: string 
    team_id: string
    caller_name: string 
    caller_number: string 
    location: string 
    description: string
    num_people_involved: number 
    hazard: string 
    time_of_call: Date
    time_proceeding_scene: Date | null
    time_arrival_scene: Date | null
    time_proceeding_hospital: Date | null 
    time_arrival_hospital: Date | null 
    time_proceeding_base: Date | null 
    time_arrival_base: Date | null 
    remarks: string 
    status: DispatchStatusEnum 
    
    is_cancelled: boolean
    is_completed: boolean

    dispatcher: User
    emergency: Emergency
    team: Team
}