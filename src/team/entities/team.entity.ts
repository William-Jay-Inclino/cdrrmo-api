import { User } from "src/user/entities"
import { TeamStatusEnum } from "."

export class Team{
    id: string
    team_leader_id: string 
    name: string
    status:  TeamStatusEnum
    team_leader: User
    teamMembers: TeamMember[]
}

export class TeamMember{
    id: string 
    team_id: string
    team: Team 
    member_id: string 
    member: User
}