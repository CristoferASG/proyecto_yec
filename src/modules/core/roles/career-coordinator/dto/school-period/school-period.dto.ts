import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { isDateValidationOptions, isNotEmptyValidationOptions, isStringValidationOptions } from '@utils/dto-validation';

export class SchoolPeriodDto {
  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  code: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  codeSniese: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  name: string;

  @IsString(isStringValidationOptions())
  shortName: string;

  @IsDateString({}, isDateValidationOptions())
  startedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  endedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  ordinaryStartedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  ordinaryEndedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  extraOrdinaryStartedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  extraOrdinaryEndedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  especialStartedAt: Date;

  @IsDateString({}, isDateValidationOptions())
  especialEndedAt: Date;

  @IsOptional()
  @IsUUID(undefined, { message: 'El campo institutionId debe ser un UUID válido' })
  institutionId: string;
}
