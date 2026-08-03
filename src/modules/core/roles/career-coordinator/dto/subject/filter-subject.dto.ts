import { PickType } from '@nestjs/swagger';
import { PaginationDto } from '@utils/pagination';
import { IsIn, IsOptional } from 'class-validator';
import { isInValidationOptions } from '@utils/dto-validation';

const sortableFields = ['code', 'name', 'autonomousHour'] as const;

export class FilterSubjectDto extends PickType(PaginationDto, ['page', 'limit', 'order', 'search']) {
  @IsOptional()
  @IsIn(sortableFields, isInValidationOptions())
  sort: string;
}
