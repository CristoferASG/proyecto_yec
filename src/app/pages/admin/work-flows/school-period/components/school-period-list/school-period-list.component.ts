import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {SchoolPeriodService} from "../../school-period.service";
import {CustomIcons} from "@utils/icons/custom-icons";
import {TableModule} from "primeng/table";
import {SchoolPeriodInterface} from "@modules/admin/work-flows/school-period/school-period.state";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Paginator, PaginatorState} from "primeng/paginator";
import {INITIAL_PAGINATION, PaginationInterface} from "@utils/interfaces";
import {ButtonActionComponent} from "@utils/components/button-action/button-action.component";
import {ConfirmationService, MenuItem} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {
    activateButtonAction,
    deleteButtonAction,
    editButtonAction,
    viewButtonAction
} from "@utils/components/button-action/consts";
import {Router} from "@angular/router";
import {MY_ROUTES} from "@routes";
import {debouncedSignal} from "@utils/helpers";
import {Tag} from "primeng/tag";

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
        Tag
    ],
    templateUrl: './school-period-list.component.html'
})
export class SchoolPeriodListComponent implements OnInit {
    private readonly router = inject(Router);
    protected readonly schoolPeriodService = inject(SchoolPeriodService);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly CustomIcons = CustomIcons;

    protected items = signal<SchoolPeriodInterface[]>([]);
    protected search = signal('');
    private debouncedSearch = debouncedSignal(this.search);

    protected pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled: boolean = false;

    /** Id del periodo actualmente abierto (para marcar el estado activo/inactivo). */
    protected openPeriodId = signal<string>('');

    constructor() {
        this.searching();
    }

    ngOnInit(): void {
        this.loadItems();
        this.loadOpenPeriod();
    }

    protected onSearchInput(event: Event): void {
        this.search.set((event.target as HTMLInputElement).value);
    }

    private searching(): void {
        effect(() => {
            const term = this.debouncedSearch();

            if (term) this.findSchoolPeriods(1, term);
            else this.findSchoolPeriods();
        });
    }

    private loadOpenPeriod() {
        this.schoolPeriodService.findOpenSchoolPeriod().subscribe({
            next: (response) => {
                this.openPeriodId.set(response?.id ?? '');
            }
        });
    }

    private buildButtonActions(item: SchoolPeriodInterface, index: number): void {
        const actions: MenuItem[] = [];
        const isOpen = item.id === this.openPeriodId();

        actions.push({
            ...viewButtonAction,
            command: () => this.goToCreate()
        });

        actions.push({
            ...editButtonAction,
            command: () => this.goToEdit(item)
        });

        // state se conserva en school-period: solo un periodo puede estar abierto.
        if (!isOpen) {
            actions.push({
                ...activateButtonAction,
                command: () => this.open(item)
            });
        } else {
            actions.push({
                ...deleteButtonAction,
                label: 'Cerrar',
                command: () => this.close(item)
            });
        }

        actions.push({
            ...deleteButtonAction,
            command: () => this.delete(item)
        });

        this.buttonActions.set(actions);
    }

    private loadItems() {
        this.findSchoolPeriods();
    }

    protected goToCreate() {
        this.router.navigate([MY_ROUTES.adminPages.schoolPeriod.form.absolute, 'new']);
    }

    private goToEdit(item: any) {
        this.router.navigate([MY_ROUTES.adminPages.schoolPeriod.form.absolute, item.id]);
    }

    private open(item: SchoolPeriodInterface): void {
        this.schoolPeriodService.openSchoolPeriod(item.id).subscribe({
            next: () => {
                this.loadItems();
                this.loadOpenPeriod();
            }
        });
    }

    private close(item: SchoolPeriodInterface): void {
        this.schoolPeriodService.closeSchoolPeriod(item.id).subscribe({
            next: () => {
                this.loadItems();
                this.loadOpenPeriod();
            }
        });
    }

    private delete(item: SchoolPeriodInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Eliminar',
                severity: 'danger',
            },
            accept: () => {
                this.schoolPeriodService.deleteSchoolPeriod(item.id).subscribe({
                    next: () => {
                        this.findSchoolPeriods();
                    }
                })
            },
        });
    }

    private findSchoolPeriods(page = 1, search = '') {
        this.schoolPeriodService.findSchoolPeriods(page, search).subscribe({
            next: (response) => {
                this.items.set(response.data);
                this.pagination.set(response.pagination!);
            }
        });
    }

    protected onSelect({item, index}: { item: any; index: number }) {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    protected onPageChange(paginatorState: PaginatorState) {
        if (paginatorState?.page || paginatorState.page === 0) this.findSchoolPeriods(paginatorState.page + 1);
    }
}
