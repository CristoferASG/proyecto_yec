import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {
    CareerListComponent
} from "@modules/admin/work-flows/career/components/career-list/career-list.component";
import {CareerFormComponent} from "@modules/admin/work-flows/career/components/career-form/career-form.component";
import {SubjectsFormComponent} from "@modules/admin/work-flows/subjects/components/subjects-form/components/subjects-form/subjects-form.component";
import {SubjectsListComponent} from "@modules/admin/work-flows/subjects/components/subjects-list/subjects-list.component";
import { InstitutionListComponent } from './work-flows/institution/institution-list/institution-list-component';

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Listado de Usuarios',
        loadComponent: () => CareerListComponent
    },
    {
        path: MY_ROUTES.adminPages.user.form.base,
        title: 'Listado de Usuarios',
        loadComponent: () => CareerFormComponent
    },
    {
        path: MY_ROUTES.adminPages.subject.base,
        title: 'Listado de Asignaturas',
        loadComponent: () => SubjectsListComponent
    },
    {
        path: MY_ROUTES.adminPages.subject.form.base + '/:id',
        title: 'Registro de Asignatura',
        loadComponent: () => SubjectsFormComponent
    },
    {
        path: MY_ROUTES.adminPages.institution.base,
        title: 'Listado de Instituciones',
        loadComponent: () => InstitutionListComponent
    }


] as Routes;
