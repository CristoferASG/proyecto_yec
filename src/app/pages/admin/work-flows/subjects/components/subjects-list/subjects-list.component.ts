import {Component, effect, inject, OnInit, signal, untracked} from '@angular/core';
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
import {SubjectInterface} from '../subjects-form/models/subjects.model';
import {SubjectsStore} from '../../subjects.store';

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
export class SubjectsListComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly subjectsStore = inject(SubjectsStore);
    protected readonly CustomIcons = CustomIcons;

    // "Fuente de datos" simulada del store
    private readonly allItems = this.subjectsStore.items;

    // Datos reactivos que se pintan en la tabla
    protected items = signal<SubjectInterface[]>([]);
    protected search = signal('');
    private readonly debouncedSearch = debouncedSignal(this.search);

    protected pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled: boolean = false;

    constructor() {
        // Effects
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

            if (term) this.findSubjects(1, term);
            else this.findSubjects();
        });
    }

    private loadItems(): void {
        this.findSubjects();
    }

    /**
     * Simula filtrado + paginación sobre los datos locales del Store,
     * manteniendo la misma firma para cuando se conecte al Backend
     * (SubjectsService.findSubjects).
     */
    private findSubjects(page = 1, search = '') {
        untracked(() => {
            const term = search.toLowerCase();

            const filtered = this.allItems().filter(item =>
                !term ||
                item.code.toLowerCase().includes(term) ||
                item.name.toLowerCase().includes(term)
            );

            const limit = this.pagination().limit;
            const start = (page - 1) * limit;

            this.items.set(filtered.slice(start, start + limit));

            this.pagination.update(current => ({
                ...current,
                page,
                totalItems: filtered.length
            }));
        });
    }

    private buildButtonActions(item: SubjectInterface, index: number): void {
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
        this.router.navigate([MY_ROUTES.adminPages.subject.form.absolute, 'new']);
    }

    private goToEdit(item: SubjectInterface) {
        this.router.navigate([MY_ROUTES.adminPages.subject.form.absolute, item.id]);
    }

    private goToView(item: SubjectInterface) {
        this.router.navigate(
            [MY_ROUTES.adminPages.subject.form.absolute, item.id],
            {queryParams: {mode: 'view'}}
        );
    }

    private delete(item: SubjectInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: `¿Está seguro de eliminar la asignatura "${item.name}"?`,
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
                this.subjectsStore.items.update(items =>
                    items.filter(current => current.id !== item.id)
                );
                this.findSubjects(this.pagination().page, this.search());
            },
        });
    }

    private hide(item: SubjectInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: `¿Está seguro de ocultar la asignatura "${item.name}"?`,
            header: 'Ocultar asignatura',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {label: 'Cancelar', severity: 'secondary', text: true},
            acceptButtonProps: {label: 'Sí, ocultar'},
            accept: () => this.updateVisibility(item.id, false)
        });
    }

    private reactivate(item: SubjectInterface): void {
        this.updateVisibility(item.id, true);
    }

    private updateVisibility(id: string, isVisible: boolean): void {
        this.subjectsStore.items.update(items =>
            items.map(current => (current.id === id ? {...current, isVisible} : current))
        );

        this.findSubjects(this.pagination().page, this.search());
    }

    protected onSelect({item, index}: { item: SubjectInterface; index: number }) {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    protected onPageChange(paginatorState: PaginatorState) {
        if (paginatorState?.page || paginatorState.page === 0) {
            this.findSubjects(paginatorState.page + 1, this.search());
        }
    }
}
