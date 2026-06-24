import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { InstitutionStore } from '@/pages/admin/work-flows/institution-management/institution.store';

import { InstitutionFormComponent } from '@/pages/admin/components/institution-form/institution-form';

import {
  InstitutionState,
  INSTITUTION_FORM_INITIAL_STATE
} from '@/pages/admin/work-flows/institution-management/institution.state';

import { InstitutionEntity } from '@/pages/admin/components/models/institution.model';


@Component({
  selector: 'app-institution-list',
  imports: [
    ButtonModule,
    DialogModule,
    TableModule,
    InstitutionFormComponent
  ],
  templateUrl: './institution-list.html'
})
export class InstitutionListComponent {

  private readonly store = inject(InstitutionStore);

  protected visible = signal(false);

  protected editingId = signal<string | null>(null);

  protected editingData = signal<InstitutionEntity | InstitutionState | null>(null);

  protected institutions = computed(() =>
    this.store.institutions()
  );

  createInstitution(): void {

    // Ensure any previous form state is cleared so the form opens empty
    this.store.resetForm();

    this.editingId.set(null);

    // Pass an explicit empty model to the form component so it renders blank inputs
    this.editingData.set(structuredClone(INSTITUTION_FORM_INITIAL_STATE));

    this.visible.set(true);
  }

  editInstitution(item: InstitutionEntity): void {

    this.editingId.set(item.id);

    this.editingData.set(structuredClone(item));

    this.visible.set(true);
  }

  deleteInstitution(id: string): void {
    this.store.delete(id);
  }

  saveInstitution(data: InstitutionState): void {

    const id = this.editingId();

    if (id) {
      this.store.update(id, data);
    } else {
      this.store.create(data);
    }

    this.visible.set(false);

    this.editingId.set(null);

    this.editingData.set(null);
  }
}