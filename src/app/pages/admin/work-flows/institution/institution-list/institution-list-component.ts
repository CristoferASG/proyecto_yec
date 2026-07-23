import {
  Component,
  effect,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';

import {INITIAL_PAGINATION, PaginationInterface} from "@utils/interfaces"

import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';

import {
  deleteButtonAction,
  editButtonAction,
  viewButtonAction
} from '@utils/components/button-action/consts';

import { CustomIcons } from '@utils/icons/custom-icons';
import { debouncedSignal } from '@utils/helpers';

import { InstitutionFormComponent } from '../institution-form/components/institution-form/institution-form';

import { InstitutionService } from '../institution.service';
import { InstitutionStore } from '../institution.store';

import {
  InstitutionInterface,
  InstitutionState
} from '../institution.state';

@Component({
  selector: 'app-institution-list',
  imports: [
    Button,
    DialogModule,
    TableModule,
    InputText,
    InputGroup,
    Paginator,
    ButtonActionComponent,
    Tooltip,
    InstitutionFormComponent
  ],
  templateUrl: './institution-list-component.html'
})
export class InstitutionListComponent implements OnInit {
  protected readonly institutionService = inject(InstitutionService);
  protected readonly institutionStore = inject(InstitutionStore);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly CustomIcons = CustomIcons;

  protected readonly items = signal<InstitutionInterface[]>([]);
  protected readonly search = signal('');
  private readonly debouncedSearch = debouncedSignal(this.search);

  protected readonly pagination = signal<PaginationInterface>(
    INITIAL_PAGINATION
  );

  protected readonly buttonActions = signal<MenuItem[]>([]);
  protected isButtonActionsEnabled = false;

  protected readonly dialogVisible = signal<boolean>(false);
  protected readonly selectedInstitutionId = signal<string | null>(null);

  constructor() {
    this.searching();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  protected onSearchInput(event: Event): void {
    this.search.set(
      (event.target as HTMLInputElement).value
    );
  }

  private searching(): void {
    effect(() => {
      const term = this.debouncedSearch();

      if (term) {
        this.findInstitutions(1, term);
        return;
      }

      this.findInstitutions();
    });
  }

  private loadItems(): void {
    this.findInstitutions();
  }

  protected goToCreate(): void {
    this.selectedInstitutionId.set(null);
    this.institutionStore.resetForm();
    this.dialogVisible.set(true);
  }

  private goToEdit(item: InstitutionInterface): void {
    this.selectedInstitutionId.set(item.id);
    this.institutionStore.resetForm();

    this.institutionService.findInstitution(item.id).subscribe({
      next: (response) => {
        this.institutionStore.loadInstitution(response);
        this.dialogVisible.set(true);
      }
    });
  }

  private delete(item: InstitutionInterface): void {
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
        label: 'Sí, Eliminar'
      },
      accept: () => {
        this.institutionService.deleteInstitution(item.id).subscribe({
          next: () => {
            this.findInstitutions();
          }
        });
      }
    });
  }

  private findInstitutions(
    page = 1,
    search = ''
  ): void {
    this.institutionService.findInstitutions(page, search).subscribe({
      next: (response) => {
        this.items.set(
          response.data as InstitutionInterface[]
        );

        this.pagination.set(
          response.pagination ?? INITIAL_PAGINATION
        );
      }
    });
  }

  private buildButtonActions(
    item: InstitutionInterface,
    index: number
  ): void {
    const actions: MenuItem[] = [];

    actions.push({
      ...viewButtonAction,
      command: () => this.goToEdit(item)
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

  protected onSelect({
    item,
    index
  }: {
    item: InstitutionInterface;
    index: number;
  }): void {
    this.isButtonActionsEnabled = true;
    this.buildButtonActions(item, index);
  }

  protected onPageChange(paginatorState: PaginatorState): void {
    if (paginatorState?.page || paginatorState.page === 0) {
      this.findInstitutions(
        paginatorState.page + 1,
        this.search()
      );
    }
  }

  protected onInstitutionSaved(data: InstitutionState): void {
    const id = this.selectedInstitutionId();

    if (id) {
      this.update(id, data);
      return;
    }

    this.create(data);
  }

  private create(payload: InstitutionState): void {
    this.institutionService.createInstitution(payload).subscribe({
      next: () => {
        this.closeDialog();
        this.findInstitutions();
      }
    });
  }

  private update(
    id: string,
    payload: InstitutionState
  ): void {
    this.institutionService.updateInstitution(id, payload).subscribe({
      next: () => {
        this.closeDialog();
        this.findInstitutions();
      }
    });
  }

  protected closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedInstitutionId.set(null);
    this.institutionStore.resetForm();
  }

  protected onDialogVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
      return;
    }

    this.dialogVisible.set(true);
  }

  protected getStateLabel(state: boolean): string {
    return state ? 'Activo' : 'Inactivo';
  }

  protected getVisibleLabel(isVisible: boolean): string {
    return isVisible ? 'Sí' : 'No';
  }
}





