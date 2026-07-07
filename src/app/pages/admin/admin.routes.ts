import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {
    CareerListComponent
} from "@modules/admin/work-flows/career-registration/components/career-list/career-list.component";
import {CareerComponent} from "@modules/admin/work-flows/career-registration/components/career/career.component";
import {SubjectsComponent} from "@modules/admin/work-flows/subjects-registration/Components/subjects/subjects.component";
import {SubjectsListComponent} from "@modules/admin/work-flows/subjects-registration/Components/subjects-list/subjects-list.component";

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Listado de Usuarios',
        loadComponent: () => CareerListComponent
    },
    {
        path: MY_ROUTES.adminPages.user.form.base,
        title: 'Listado de Usuarios',
        loadComponent: () => CareerComponent
    },
    {
        path: MY_ROUTES.adminPages.subject.base,
        title: 'Listado de Asignaturas',
        loadComponent: () => SubjectsListComponent
    },
    {
        path: MY_ROUTES.adminPages.subject.form.base,
        title: 'Registro de Asignatura',
        loadComponent: () => SubjectsComponent
    }

] as Routes;
