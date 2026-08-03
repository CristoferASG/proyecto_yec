import { IsNumber, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';
import { isNumberValidationOptions, isStringValidationOptions, minLengthValidationOptions } from '@utils/dto-validation';

export class SubjectDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'El campo academicPeriodId debe ser un UUID válido' })
  academicPeriodId: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'El campo careerId debe ser un UUID válido' })
  careerId: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'El campo typeId debe ser un UUID válido' })
  typeId: string;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El campo autonomousHour debe ser mayor o igual a 0' })
  autonomousHour: number;

  @IsString(isStringValidationOptions())
  @MinLength(5, minLengthValidationOptions())
  code: string;

  @IsOptional()
  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El campo credits debe ser mayor o igual a 0' })
  credits: number;

  @IsString(isStringValidationOptions())
  name: string;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El campo practicalHour debe ser mayor o igual a 0' })
  practicalHour: number;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El campo scale debe ser mayor o igual a 0' })
  @Max(1, { message: 'El campo scale debe ser menor o igual a 1' })
  scale: number;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El campo teacherHour debe ser mayor o igual a 0' })
  teacherHour: number;
}
