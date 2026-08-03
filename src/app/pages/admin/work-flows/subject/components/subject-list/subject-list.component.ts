import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {SubjectService} from "../../subject.service";
import {CustomIcons} from "@utils/icons/custom-icons";
import {TableModule} from "primeng/table";
import {SubjectInterface} from "@modules/admin/work-flows/subject/subject.state";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Paginator, PaginatorState} from "primeng/paginator";
import {INITIAL_PAGINATION, PaginationInterface} from "@utils/interfaces";
import {ButtonActionComponent} from "@utils/components/button-action/button-action.component";
import {ConfirmationService, MenuItem} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {
    deleteButtonAction,
    editButtonAction,
    viewButtonAction
} from "@utils/components/button-action/consts";
import {Router} from "@angular/router";
import {MY_ROUTES} from "@routes";
import {debouncedSignal} from "@utils/helpers";

@Component({
    selector: 'app-subject-list',
    imports: [
        Button,
        TableModule,
        InputText,
        InputGroup,
        Paginator,
        ButtonActionComponent,
        Tooltip
    ],
    templateUrl: './subject-list.component.html'
})
export class SubjectListComponent implements OnInit {
    private readonly router = inject(Router);
    protected readonly subjectService = inject(SubjectService);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly CustomIcons = CustomIcons;

    protected items = signal<SubjectInterface[]>([]);
    protected search = signal('');
    private debouncedSearch = debouncedSignal(this.search);

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

            if (term) this.findSubjects(1, term);
            else this.findSubjects();
        });
    }

    private buildButtonActions(item: SubjectInterface, index: number): void {
        const actions: MenuItem[] = [];

        actions.push({
            ...viewButtonAction,
            command: () => this.goToCreate()
        });

        actions.push({
            ...editButtonAction,
            command: () => this.goToEdit(item)
        });

        actions.push({
            ...deleteButtonAction,
            command: () => this.delete(item)
        });

        this.buttonActions.set(actions);
    }

    private loadItems() {
        this.findSubjects();
    }

    protected goToCreate() {
        this.router.navigate([MY_ROUTES.adminPages.subject.form.absolute, 'new']);
    }

    private goToEdit(item: any) {
        this.router.navigate([MY_ROUTES.adminPages.subject.form.absolute, item.id]);
    }

    private delete(item: SubjectInterface): void {
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
                this.subjectService.deleteSubject(item.id).subscribe({
                    next: () => {
                        this.findSubjects();
                    }
                })
            },
        });
    }

    private findSubjects(page = 1, search = '') {
        this.subjectService.findSubjects(page, search).subscribe({
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
        if (paginatorState?.page || paginatorState.page === 0) this.findSubjects(paginatorState.page + 1);
    }
}
