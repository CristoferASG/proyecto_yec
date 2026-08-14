import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import {
  isEmailValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  maxLengthValidationOptions,
  minLengthValidationOptions,
} from '@utils/dto-validation';

/** 2 MB (binario) ≈ 2_700_000 caracteres base64: tope para el logo embebido. */
const LOGO_MAX_LENGTH = 2_700_000;

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
  @MaxLength(LOGO_MAX_LENGTH, maxLengthValidationOptions())
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
