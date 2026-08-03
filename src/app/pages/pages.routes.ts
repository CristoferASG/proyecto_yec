import {Routes} from '@angular/router';
import {MY_ROUTES} from "@routes";

export default [
    {
        path: MY_ROUTES.adminPages.career.base,
        title: 'Carreras',
        loadChildren: () => import('@modules/admin/admin.routes')
    },
    {path: '**', redirectTo: '/notfound'}
] as Routes;
