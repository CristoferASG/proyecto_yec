import { PickType } from '@nestjs/swagger';
import { SchoolPeriodDto } from '@modules/core/roles/career-coordinator/dto/school-period/school-period.dto';

export class UpdateSchoolPeriodDto extends PickType(SchoolPeriodDto, [
  'code',
  'codeSniese',
  'name',
  'shortName',
  'startedAt',
  'endedAt',
  'ordinaryStartedAt',
  'ordinaryEndedAt',
  'extraOrdinaryStartedAt',
  'extraOrdinaryEndedAt',
  'especialStartedAt',
  'especialEndedAt',
  'institutionId',
]) {}
