// export class User {}

import { DispatchStatusEnum } from "src/dispatch/entities"
import { GenderEnum, UserLevelEnum, UserStatusEnum, UserTypeEnum } from "."
import { IBART } from "src/bart/entities"
import { ICSO } from "src/cso/entities"
import { IPO } from "src/po/entities"
import { INa } from "src/na/entities"
import { ITeam, ITeamMember } from "src/team/entities"
import { ITrainingSkill } from "src/training_skill/entities"

export class User {
    id: string
    user_id: number
    user_name: string 
    user_level: UserLevelEnum
    password: string
    last_name: string 
    first_name: string
    gender: GenderEnum 
    address: string 
    birth_date: Date
    contact_no: string 
    blood_type: string 
    status: UserStatusEnum 
    dispatch_status?: DispatchStatusEnum 
    type: UserTypeEnum

    emergencyContacts?: IEmergencyContact[]

    bart_id?: string | null
    cso_id?: string | null 
    po_id?: string | null 
    na_id?: string | null 

    Bart?: IBART
    Cso?: ICSO 
    Po?: IPO
    Na?: INa

    teamMembers?: ITeamMember[]
    teamLeader?: ITeam
    skills: IUserSkill[]
    
}

export interface IEmergencyContact{
    id: string
    user: User
    user_id: string
    name: string
    relationship: string
    mobile: string

    // set programmatically 
    errorName: boolean
    errorRelationship: boolean
    errorMobile: boolean 
    errorInvalidMobile: boolean
}


export interface IUserSkill{
    id: string 
    user: User 
    user_id: string 
    TrainingSkill: ITrainingSkill
    training_skill_id: string 
    SkillCertificate: ISkillCertificate[]
}


export interface ISkillCertificate{
    id: string 
    userSkill: IUserSkill
    user_skill_id: string 
    certificateUrl: string 
}