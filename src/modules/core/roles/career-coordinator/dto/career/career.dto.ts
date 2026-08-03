import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { isNotEmptyValidationOptions, isStringValidationOptions, minLengthValidationOptions } from '@utils/dto-validation';

export class CareerDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'El campo institutionId debe ser un UUID válido' })
  institutionId: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'El campo modalityId debe ser un UUID válido' })
  modalityId: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'El campo typeId debe ser un UUID válido' })
  typeId: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  acronym: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  code: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  codeSniese: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  degree: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  logo: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  name: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  resolutionNumber: string;

  @IsString(isStringValidationOptions())
  @MinLength(3, minLengthValidationOptions())
  shortName: string;
}