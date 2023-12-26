import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, UserSkillDto, EmergencyContactDto } from '.';
import { IsEnum, IsNotEmpty, IsString, IsDate, IsOptional, IsArray, Validate } from 'class-validator';
import { IsValidUserSkillDtoArray, IsValidEmergencyContactDtoArray } from '../validators';
import { GenderEnum, UserLevelEnum, UserStatusEnum, UserTypeEnum } from '../entities';
import { DispatchStatusEnum } from 'src/dispatch/entities';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsEnum(UserLevelEnum)
    user_level: UserLevelEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsEnum(GenderEnum)
    gender: GenderEnum;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
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
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum;

    @ApiProperty()
    @IsEnum(DispatchStatusEnum)
    dispatch_status: DispatchStatusEnum;

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

    @ApiProperty()
    @IsOptional()
    @IsString()
    image_url?: string;
}
