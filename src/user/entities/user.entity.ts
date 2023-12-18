// export class User {}

import { DispatchStatusEnum } from "src/dispatch/entities"
import { GenderEnum, UserLevelEnum, UserStatusEnum, UserTypeEnum } from "."
import { BART } from "src/bart/entities"
import { CSO } from "src/cso/entities"
import { PO } from "src/po/entities"
import { Na } from "src/na/entities"
import { Team, TeamMember } from "src/team/entities"
import { TrainingSkill } from "src/training-skill/entities"

export class User {
    id: string
    user_id: number
    user_name: string 
    user_level: UserLevelEnum
    password?: string
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
    image_url: string | null

    emergencyContacts?: EmergencyContact[]

    bart_id?: string | null
    cso_id?: string | null 
    po_id?: string | null 
    na_id?: string | null 

    Bart?: BART
    Cso?: CSO 
    Po?: PO
    Na?: Na

    teamMembers?: TeamMember[]
    teamLeader?: Team
    skills: UserSkill[]
    
}

export class EmergencyContact{
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


export class UserSkill{
    id: string 
    user: User 
    user_id: string 
    TrainingSkill: TrainingSkill
    training_skill_id: string 
    SkillCertificate: SkillCertificate[]
}


export class SkillCertificate{
    id: string 
    userSkill: UserSkill
    user_skill_id: string 
    certificateUrl: string 
}