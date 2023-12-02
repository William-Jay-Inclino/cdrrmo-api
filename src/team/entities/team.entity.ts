import { User } from "src/user/entities"
import { TeamStatusEnum } from "."

export interface ITeam{
    id: string
    team_leader_id: string 
    name: string
    status:  TeamStatusEnum
    team_leader: User
    teamMembers: ITeamMember[]

    // props that are set programmatically
    statusText?: string
    statusObj?: {
        id: string,
        text: string,
        color: string,
    },

    label?: string
    isActivated?: boolean
}

export interface ITeamMember{
    id: string 
    team_id: string
    team: ITeam 
    member_id: string 
    member: User
}