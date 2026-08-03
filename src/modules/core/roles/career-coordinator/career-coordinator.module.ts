import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { coreProviders } from '@modules/core/core.provider';
import { SharedCoreModule } from '@modules/core/shared-core/shared-core.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { controllers } from '@modules/core/roles/career-coordinator/controllers';
import { CareersService } from '@modules/core/roles/career-coordinator/services/careers.service';
import { InstitutionsService } from '@modules/core/roles/career-coordinator/services/institutions.service';
import { SubjectsService } from '@modules/core/roles/career-coordinator/services/subjects.service';
import { SchoolPeriodsService } from '@modules/core/roles/career-coordinator/services/school-periods.service';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule, SharedCoreModule, ReportsModule],
  controllers,
  providers: [...coreProviders, CareersService, InstitutionsService, SubjectsService, SchoolPeriodsService],
  exports: [],
})
export class CareerCoordinatorModule {}
