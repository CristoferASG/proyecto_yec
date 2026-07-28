import {Component, effect, inject, OnInit, signal, untracked} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Button} from 'primeng/button';
import {InputGroup} from 'primeng/inputgroup';
import {InputText} from 'primeng/inputtext';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {Tooltip} from 'primeng/tooltip';
import {MY_ROUTES} from '@routes';
import {ButtonActionComponent} from '@utils/components/button-action/button-action.component';
import {
    activateButtonAction,
    deleteButtonAction,
    editButtonAction,
    inactivationButtonAction,
    viewButtonAction
} from '@utils/components/button-action/consts';
import {debouncedSignal} from '@utils/helpers';
import {CustomIcons} from '@utils/icons/custom-icons';
import {INITIAL_PAGINATION, PaginationInterface} from '@utils/interfaces';
import {SchoolPeriodInterface} from '../../school-period.state';
import {SchoolPeriodStore} from '../../school-period.store';

@Component({
    selector: 'app-school-period-list',
    imports: [
        Button,
        TableModule,
        InputText,
        InputGroup,
        Paginator,
        ButtonActionComponent,
        Tooltip,
        DatePipe
    ],
    templateUrl: './school-period-list.component.html'
})
export class SchoolPeriodListComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly schoolPeriodStore = inject(SchoolPeriodStore);
    protected readonly CustomIcons = CustomIcons;

    // "Fuente de datos" simulada del store
    private readonly allItems = this.schoolPeriodStore.items;

    // Datos reactivos que se pintan en la tabla
    protected items = signal<SchoolPeriodInterface[]>([]);
    protected search = signal('');
    private readonly debouncedSearch = debouncedSignal(this.search);

    protected pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled: boolean = false;

    constructor() {
        this.searching();
    }

    ngOnInit(): void {
        this.loadItems();
    }

    protected onSearchInput(event: Event): void {
        this.search.set((event.target as HTMLInputElement).value);
    }

    private searching(): void {
        effect(() => {
            const term = this.debouncedSearch();

            if (term) this.findSchoolPeriod(1, term);
            else this.findSchoolPeriod();
        });
    }

    private loadItems(): void {
        this.findSchoolPeriod();
    }

    /**
     * Simula filtrado + paginación sobre los datos locales del Store,
     * manteniendo la misma firma para cuando se conecte al Backend
     * (SchoolPeriodService.findSchoolPeriod).
     *
     * OJO: las lecturas/escrituras se ejecutan dentro de `untracked` para que
     * el effect de `searching()` no se re-suscriba a `pagination`/`items` y
     * arme un bucle infinito de change detection (que congela la UI).
     * Además, la escritura de `pagination` se hace solo si los valores
     * relevantes realmente cambiaron, para no forzar al `p-paginator` a
     * re-emitir `onPageChange` en bucle.
     */
    private findSchoolPeriod(page = 1, search = '') {
        untracked(() => {
            const term = search.toLowerCase();

            const filtered = this.allItems().filter(item =>
                !term ||
                item.name.toLowerCase().includes(term)
            );

            const limit = this.pagination().limit;
            const start = (page - 1) * limit;

            const paged = filtered.slice(start, start + limit);
            const totalItems = filtered.length;

            const current = this.items();
            if (current.length !== paged.length || current.some((it, i) => it !== paged[i])) {
                this.items.set(paged);
            }

            const pag = this.pagination();
            if (pag.page !== page || pag.totalItems !== totalItems) {
                this.pagination.update(curr => ({
                    ...curr,
                    page,
                    totalItems
                }));
            }
        });
    }

    private buildButtonActions(item: SchoolPeriodInterface, index: number): void {
        const actions: MenuItem[] = [];

        actions.push({
            ...viewButtonAction,
            command: () => this.goToView(item)
        });

        actions.push({
            ...editButtonAction,
            command: () => this.goToEdit(item)
        });

        actions.push({
            ...deleteButtonAction,
            command: () => this.delete(item)
        });

        if (item.isVisible) {
            actions.push({
                ...inactivationButtonAction,
                command: () => this.hide(item)
            });
        } else {
            actions.push({
                ...activateButtonAction,
                command: () => this.reactivate(item)
            });
        }

        this.buttonActions.set(actions);
    }

    /** Navegación **/
    protected goToCreate() {
        this.router.navigate([MY_ROUTES.adminPages.schoolPeriod.form.absolute, 'new']);
    }

    private goToEdit(item: SchoolPeriodInterface) {
        this.router.navigate([MY_ROUTES.adminPages.schoolPeriod.form.absolute, item.id]);
    }

    private goToView(item: SchoolPeriodInterface) {
        this.router.navigate(
            [MY_ROUTES.adminPages.schoolPeriod.form.absolute, item.id],
            {queryParams: {mode: 'view'}}
        );
    }

    private delete(item: SchoolPeriodInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: `¿Está seguro de eliminar el periodo lectivo "${item.name}"?`,
            header: 'Eliminar',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar',
            },
            accept: () => {
                this.schoolPeriodStore.items.update(items =>
                    items.filter(current => current.id !== item.id)
                );
                this.findSchoolPeriod(this.pagination().page, this.search());
            },
        });
    }

    private hide(item: SchoolPeriodInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: `¿Está seguro de ocultar el periodo lectivo "${item.name}"?`,
            header: 'Ocultar periodo lectivo',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {label: 'Cancelar', severity: 'secondary', text: true},
            acceptButtonProps: {label: 'Sí, ocultar'},
            accept: () => this.updateVisibility(item.id, false)
        });
    }

    private reactivate(item: SchoolPeriodInterface): void {
        // Igual que hide(): va por confirm() (asíncrono) para que la mutación
        // del store no se ejecute dentro del handler del PanelMenu/drawer,
        // lo que congelaría la UI. Consistencia visual con "Ocultar".
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: `¿Está seguro de mostrar el periodo lectivo "${item.name}"?`,
            header: 'Mostrar periodo lectivo',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {label: 'Cancelar', severity: 'secondary', text: true},
            acceptButtonProps: {label: 'Sí, mostrar'},
            accept: () => this.updateVisibility(item.id, true)
        });
    }

    private updateVisibility(id: string, isVisible: boolean): void {
        this.schoolPeriodStore.items.update(items =>
            items.map(current => (current.id === id ? {...current, isVisible} : current))
        );

        this.findSchoolPeriod(this.pagination().page, this.search());
    }

    protected onSelect({item, index}: { item: SchoolPeriodInterface; index: number }) {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    protected onPageChange(paginatorState: PaginatorState) {
        const requestedPage = (paginatorState?.page ?? 0) + 1;
        const currentPage = this.pagination().page;

        if (paginatorState && requestedPage !== currentPage) {
            this.findSchoolPeriod(requestedPage, this.search());
        }
    }
}
