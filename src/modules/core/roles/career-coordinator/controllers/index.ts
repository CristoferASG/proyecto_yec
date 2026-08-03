import { CareersController } from '@modules/core/roles/career-coordinator/controllers/careers.controller';
import { InstitutionsController } from '@modules/core/roles/career-coordinator/controllers/institutions.controller';
import { SubjectsController } from '@modules/core/roles/career-coordinator/controllers/subjects.controller';
import { SchoolPeriodsController } from '@modules/core/roles/career-coordinator/controllers/school-periods.controller';

export const controllers = [
  CareersController,
  InstitutionsController,
  SubjectsController,
  SchoolPeriodsController,
];
