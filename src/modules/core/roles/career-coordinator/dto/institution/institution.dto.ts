import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import {
  isEmailValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  minLengthValidationOptions,
} from '@utils/dto-validation';

export class InstitutionDto {
  @IsString(isStringValidationOptions())
  @MinLength(3, minLengthValidationOptions())
  acronym: string;

  @IsString(isStringValidationOptions())
  @MinLength(3, minLengthValidationOptions())
  code: string;

  @IsString(isStringValidationOptions())
  codeSniese: string;

  @IsString(isStringValidationOptions())
  denomination: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  name: string;

  @IsString(isStringValidationOptions())
  shortName: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  cellphone: string;

  @IsOptional()
  @IsEmail({}, isEmailValidationOptions())
  email: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  logo: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  phone: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  slogan: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  web: string;
}
