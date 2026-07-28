import {
  Component,
  effect,
  inject,
  OnInit,
  signal
} from '@angular/core';
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
  deleteButtonAction,
  editButtonAction,
  viewButtonAction
} from '@utils/components/button-action/consts';
import {debouncedSignal} from '@utils/helpers';
import {CustomIcons} from '@utils/icons/custom-icons';
import {INITIAL_PAGINATION, PaginationInterface} from '@utils/interfaces';

import {InstitutionInterface} from '../../institution.state';
import {InstitutionService} from '../../institution.service';

@Component({
  selector: 'app-institution-list',
  imports: [
    Button,
    TableModule,
    InputText,
    InputGroup,
    Paginator,
    ButtonActionComponent,
    Tooltip
  ],
  templateUrl: './institution-list-component.html'
})
export class InstitutionListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly institutionService = inject(InstitutionService);
  protected readonly CustomIcons = CustomIcons;

  // Datos reactivos que se pintan en la tabla
  protected items = signal<InstitutionInterface[]>([]);
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

      if (term) this.findInstitution(1, term);
      else this.findInstitution();
    });
  }

  private loadItems(): void {
    this.findInstitution();
  }

  /**
   * Consulta el listado paginado al backend (InstitutionService.findInstitution)
   * y sincroniza `items` + `pagination` con la respuesta.
   */
  private findInstitution(page = 1, search = '') {
    this.institutionService.findInstitution(page, search).subscribe({
      next: (response) => {
        this.items.set(response.data ?? []);
        this.pagination.update(curr => ({
          ...curr,
          page: response.pagination?.page ?? page,
          limit: response.pagination?.limit ?? curr.limit,
          totalItems: response.pagination?.totalItems ?? (response.data?.length ?? 0),
          lastPage: response.pagination?.lastPage
        }));
      }
    });
  }

  private buildButtonActions(item: InstitutionInterface): void {
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

    this.buttonActions.set(actions);
  }

  /** Navegación **/
  protected goToCreate() {
    this.router.navigate([MY_ROUTES.adminPages.institution.form.absolute, 'new']);
  }

  private goToEdit(item: InstitutionInterface) {
    this.router.navigate([MY_ROUTES.adminPages.institution.form.absolute, item.id]);
  }

  private goToView(item: InstitutionInterface) {
    this.router.navigate(
      [MY_ROUTES.adminPages.institution.form.absolute, item.id],
      {queryParams: {mode: 'view'}}
    );
  }

  private delete(item: InstitutionInterface): void {
    this.confirmationService.confirm({
      key: 'confirmdialog',
      message: `¿Está seguro de eliminar la institución "${item.name}"?`,
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
        this.institutionService.deleteInstitution(item.id).subscribe({
          next: () => {
            this.findInstitution(this.pagination().page, this.search());
          }
        });
      },
    });
  }

  protected onSelect({item, index}: { item: InstitutionInterface; index: number }) {
    this.isButtonActionsEnabled = true;
    this.buildButtonActions(item);
  }

  protected onPageChange(paginatorState: PaginatorState) {
    const requestedPage = (paginatorState?.page ?? 0) + 1;
    const currentPage = this.pagination().page;

    if (paginatorState && requestedPage !== currentPage) {
      this.findInstitution(requestedPage, this.search());
    }
  }
}
