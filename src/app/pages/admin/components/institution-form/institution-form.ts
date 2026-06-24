import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal
} from '@angular/core';

import {
  FieldTree,
  form,
  FormField
} from '@angular/forms/signals';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { FormRegistryService } from '@/pages/admin/services/form-registry.service';

import { ErrorMessageDirective } from '@utils/directives/error-message.directive';

import {
  InstitutionState,
  INSTITUTION_FORM_INITIAL_STATE
} from '@/pages/admin/work-flows/institution-management/institution.state';

import { applyInstitutionValidators } from '@/pages/admin/components/validators/institution.validators';
import { InstitutionStore } from '@/pages/admin/work-flows/institution-management/institution.store';

import { EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [
    Button,
    InputText,
    ToggleSwitchModule,
    FormField,
    ErrorMessageDirective
  ],
  templateUrl: './institution-form.html'
})
export class InstitutionFormComponent implements OnInit, OnDestroy, OnChanges {

@Input()
data?: InstitutionState;

@Output()
saveForm = new EventEmitter<InstitutionState>();

  private readonly formRegistryService = inject(FormRegistryService);
  private readonly institutionStore = inject(InstitutionStore);
  
  protected form$ = signal(
    structuredClone(this.institutionStore.formState())
  )

  protected form: FieldTree<InstitutionState> = this.buildForm;

  protected statesOptions = signal([
    { id: '1', name: 'Activo' },
    { id: '2', name: 'Inactivo' }
  ]);

  ngOnInit(): void {
 
     if (this.data) {
    this.form$.set(structuredClone(this.data));
  }

    this.formRegistryService.register(
      'institution',
      this.form,
      this.form$()
    );
  }

  //cambio de copilot
  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      // If data is provided (editing), populate the form.
      // If data is undefined/null (creating new), reset form from store so fields appear empty.
      if (this.data) {
        this.form$.set(structuredClone(this.data));
      } else {
        this.form$.set(structuredClone(this.institutionStore.formState()));
      }
    }
  }

  ngOnDestroy(): void {
    this.formRegistryService.unregister('institution');
  }

  get buildForm() {
    return form(this.form$, (schema) => {
      applyInstitutionValidators(schema);
    });
  }

  async save() {
    const errors = await this.formRegistryService.getFormErrors();

     if (Object.keys(errors).length > 0) {
    return;
  }

  
  this.saveForm.emit(
    structuredClone(this.form$())
  );

 
  
    console.log(
      'Errores del formulario:',
      errors
    );
  }
}