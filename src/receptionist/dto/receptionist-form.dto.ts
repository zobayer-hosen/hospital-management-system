import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsIn,
  IsString,
} from 'class-validator';

export class ReceptionistFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsDateString()
  dateOfBirth: string;

  @IsIn(['MALE', 'FEMALE', 'OTHER'])
  gender: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  address?: string;
}