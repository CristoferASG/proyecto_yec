import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {UserList, UserForm} from '@adminModule';
import {OtroForm} from "@/pages/admin/components/otro-form/otro-form";
import { InstitutionFormComponent } from './components/institution-form/institution-form';
import { InstitutionListComponent } from './components/institution-list/institution-list.component';

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Listado de Usuarios',
        loadComponent: () => UserList
    },
    {
        path: MY_ROUTES.adminPages.user.form.base, title: 'User Form',
        loadComponent: () => UserForm
    },
    {
        path: MY_ROUTES.adminPages.user.otro.base, title: 'Otro',
        loadComponent: () => OtroForm
    },
    {
        path: MY_ROUTES.adminPages.institution.list.base, title: 'listaInstitución',
        loadComponent: () => InstitutionListComponent
    }
] as Routes;
