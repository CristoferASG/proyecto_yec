import { PickType } from '@nestjs/swagger';
import { InstitutionDto } from '@modules/core/roles/career-coordinator/dto/institution/institution.dto';

export class CreateInstitutionDto extends PickType(InstitutionDto, [
  'acronym',
  'code',
  'codeSniese',
  'denomination',
  'name',
  'shortName',
  'cellphone',
  'email',
  'logo',
  'phone',
  'slogan',
  'web',
]) {}