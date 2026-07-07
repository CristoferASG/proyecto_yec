import { Component, inject, signal } from '@angular/core';

import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Tooltip } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import {Router} from "@angular/router";
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { registrationButtonAction } from '@utils/components/button-action/consts';
import { CustomIcons } from '@utils/icons/custom-icons';
import { INITIAL_PAGINATION, PaginationInterface } from '@utils/interfaces';
import {MY_ROUTES} from "@routes";
import { SubjectsRegistrationStore } from '../../subjects-registration.store';
import { SubjectListItem } from '../../subjects-registration.state';

@Component({
    selector: 'app-subjects-list',
    imports: [
        Button,
        TableModule,
        InputText,
        InputGroup,
        Paginator,
        ButtonActionComponent,
        Tooltip
    ],
    templateUrl: './subjects-list.component.html'
})
export class SubjectsListComponent {
    protected readonly subjectsRegistrationStore = inject(SubjectsRegistrationStore);
    protected readonly CustomIcons = CustomIcons;
    private readonly router = inject(Router);

    // Datos quemados provenientes del store (solo vista, sin backend por ahora)
    protected readonly items = this.subjectsRegistrationStore.items;

    protected readonly search = signal('');
    protected readonly pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected readonly buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled = false;

    /** Construye las acciones visuales por fila (sin lógica real todavía) **/
  buildButtonActions(item: any, index: number) {
        const actions: MenuItem[] = [];

        actions.push({
            ...registrationButtonAction,
            command: () => this.goToCreate(item)
        });

        this.buttonActions.set(actions);
    }

    goToCreate(item: any) {
        this.router.navigate([MY_ROUTES.adminPages.subject.form.absolute]);
    }

    onSelect({ item, index }: { item: SubjectListItem; index: number }): void {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    /** Paginación visual únicamente; sin consulta real al backend por ahora **/
    onPageChange(paginatorState: PaginatorState): void {
        // Se implementará cuando exista conexión real con el backend
    }
}