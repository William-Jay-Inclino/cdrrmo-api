import { GenderEnum, UserLevelEnum, UserStatusEnum, UserTypeEnum } from '../entities'
import { IsEnum, IsString, IsDate, IsOptional, IsNotEmpty, Length, IsArray, Validate } from 'class-validator';
import { IsValidUserSkillDtoArray, IsValidEmergencyContactDtoArray } from '../validators';
import { Transform } from 'class-transformer';
import { EmergencyContactDto, UserSkillDto } from '.';
import { DispatchStatusEnum } from 'src/dispatch/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(UserLevelEnum)
    user_level: UserLevelEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: GenderEnum;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    birth_date: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contact_no: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum;

    @ApiProperty()
    @IsOptional()
    @IsEnum(DispatchStatusEnum)
    dispatch_status?: DispatchStatusEnum;

    @ApiProperty()
    @IsEnum(UserTypeEnum)
    type: UserTypeEnum;

    @ApiProperty()
    @IsOptional()
    @IsString()
    bart_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    cso_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    po_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    na_id?: string;

    @ApiProperty()
    @IsArray()
    @Validate(IsValidUserSkillDtoArray)
    skills: UserSkillDto[];

    @ApiProperty()
    @IsArray()
    @Validate(IsValidEmergencyContactDtoArray)
    emergencyContacts: EmergencyContactDto[];

}
