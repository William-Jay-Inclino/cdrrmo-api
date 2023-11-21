import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBartDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
}
