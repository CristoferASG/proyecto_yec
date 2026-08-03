import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {
    CareerListComponent
} from "@modules/admin/work-flows/career/components/career-list/career-list.component";
import {
    CareerContainerComponent
} from "@modules/admin/work-flows/career/components/career-container/career-container.component";
import {
    InstitutionListComponent
} from "@modules/admin/work-flows/institution/components/institution-list/institution-list.component";
import {
    InstitutionContainerComponent
} from "@modules/admin/work-flows/institution/components/institution-container/institution-container.component";
import {
    SchoolPeriodListComponent
} from "@modules/admin/work-flows/school-period/components/school-period-list/school-period-list.component";
import {
    SchoolPeriodContainerComponent
} from "@modules/admin/work-flows/school-period/components/school-period-container/school-period-container.component";
import {
    SubjectListComponent
} from "@modules/admin/work-flows/subject/components/subject-list/subject-list.component";
import {
    SubjectContainerComponent
} from "@modules/admin/work-flows/subject/components/subject-container/subject-container.component";

export default [
    {
        path: MY_ROUTES.adminPages.career.base,
        title: 'Listado de Carreras',
        loadComponent: () => CareerListComponent
    },
    {
        path: MY_ROUTES.adminPages.career.form.base + '/:id',
        title: 'Formulario de Carrera',
        loadComponent: () => CareerContainerComponent
    },
    {
        path: MY_ROUTES.adminPages.institution.base,
        title: 'Listado de Instituciones',
        loadComponent: () => InstitutionListComponent
    },
    {
        path: MY_ROUTES.adminPages.institution.form.base + '/:id',
        title: 'Formulario de Institución',
        loadComponent: () => InstitutionContainerComponent
    },
    {
        path: MY_ROUTES.adminPages.schoolPeriod.base,
        title: 'Listado de Periodos Lectivos',
        loadComponent: () => SchoolPeriodListComponent
    },
    {
        path: MY_ROUTES.adminPages.schoolPeriod.form.base + '/:id',
        title: 'Formulario de Periodo Lectivo',
        loadComponent: () => SchoolPeriodContainerComponent
    },
    {
        path: MY_ROUTES.adminPages.subject.base,
        title: 'Listado de Asignaturas',
        loadComponent: () => SubjectListComponent
    },
    {
        path: MY_ROUTES.adminPages.subject.form.base + '/:id',
        title: 'Formulario de Asignatura',
        loadComponent: () => SubjectContainerComponent
    },
] as Routes;
