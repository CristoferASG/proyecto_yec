import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  maxLengthValidationOptions,
  minLengthValidationOptions,
} from '@utils/dto-validation';

/** 2 MB (binario) ≈ 2_700_000 caracteres base64: tope para el logo embebido. */
const LOGO_MAX_LENGTH = 2_700_000;

/** Convierte "" (front, sin selección en el combo) en undefined para que @IsOptional lo trate como ausente. */
const emptyStringToUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class CareerDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'El campo institutionId debe ser un UUID válido' })
  institutionId: string;

  @IsOptional()
  @Transform(emptyStringToUndefined, { toClassOnly: true })
  @IsUUID(undefined, { message: 'El campo modalityId debe ser un UUID válido' })
  modalityId: string;

  @IsOptional()
  @Transform(emptyStringToUndefined, { toClassOnly: true })
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
  @MaxLength(LOGO_MAX_LENGTH, maxLengthValidationOptions())
  logo: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  name: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  resolutionNumber: string;

  @IsString(isStringValidationOptions())
  @MinLength(2, minLengthValidationOptions())
  shortName: string;
}