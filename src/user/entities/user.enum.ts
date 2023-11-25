export enum GenderEnum {
    Male = 1,
    Female = 2,
}

export enum UserStatusEnum{
    Active = 1,
    Inactive = 2,
}

export enum UserLevelEnum{
    Admin = 1,
    Dispatcher = 2,
    Team_Leader = 3,
    Field_Operator = 4,
}   

export enum UserTypeEnum{
    LGU_Regular = 11,
    LGU_Casual = 12,
    LGU_Job_Order = 13,
    ACDV_CSO = 21, 
    ACDV_PO = 22, 
    ACDV_BART = 23, 
    ACDV_INDIVIDUAL = 24, 
    National_Agency = 30,
}

export enum DistinctUserTypeEnum{
    LGU = 1,
    ACDV = 2,
    National_Agency = 3,
}