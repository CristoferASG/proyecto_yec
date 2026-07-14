import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {
    CareerListComponent
} from "@modules/admin/work-flows/career/components/career-list/career-list.component";
import {CareerFormComponent} from "@modules/admin/work-flows/career/components/career-form/career-form.component";
import { InstitutionListComponent } from './work-flows/institution/institution-list/institution-list-component';

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Listado de Carreras',
        loadComponent: () => CareerListComponent
    },
    {
        path: MY_ROUTES.adminPages.user.form.base + '/:id',
        title: 'Formulario de Carrera',
        loadComponent: () => CareerFormComponent
    },
    {
        path: MY_ROUTES.adminPages.institution.base,
        title: 'Listado de Instituciones',
        loadComponent: () => InstitutionListComponent
    },
] as Routes;
