import { PickType } from '@nestjs/swagger';
import { SubjectDto } from '@modules/core/roles/career-coordinator/dto/subject/subject.dto';

export class CreateSubjectDto extends PickType(SubjectDto, [
  'academicPeriodId',
  'careerId',
  'typeId',
  'autonomousHour',
  'code',
  'credits',
  'name',
  'practicalHour',
  'scale',
  'teacherHour',
]) {}