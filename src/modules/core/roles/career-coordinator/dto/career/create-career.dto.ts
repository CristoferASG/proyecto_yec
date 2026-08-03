import { PickType } from '@nestjs/swagger';
import { CareerDto } from '@modules/core/roles/career-coordinator/dto/career/career.dto';

export class CreateCareerDto extends PickType(CareerDto, [
  'institutionId',
  'modalityId',
  'typeId',
  'acronym',
  'code',
  'codeSniese',
  'degree',
  'logo',
  'name',
  'resolutionNumber',
  'shortName',
]) {}