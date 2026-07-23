import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
  WritableSignal
} from '@angular/core';

import {
  FieldTree,
  form,
  FormField
} from '@angular/forms/signals';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { CustomMessageService } from '@utils/services/custom-message.service';
import { FormRegistryService } from '@utils/services/form-registry.service';

import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';

import { InstitutionState } from '../../../institution.state';
import { InstitutionStore } from '../../../institution.store';

import { applyInfoInstitutionValidators } from '../../validators/institution.validators';

const FORM_STATE_KEY = 'institution';

@Component({
  selector: 'app-institution-form',
  imports: [
    FormField,
    Button,
    InputText,
    ToggleSwitchModule,
    LabelDirective,
    ErrorMessageDirective
  ],
  templateUrl: './institution-form.html'
})
export class InstitutionFormComponent implements OnInit, OnDestroy {
  private readonly formRegistryService = inject(FormRegistryService);
  private readonly customMessageService = inject(CustomMessageService);
  private readonly institutionStore = inject(InstitutionStore);

  readonly saved = output<InstitutionState>();

  protected readonly form$: WritableSignal<InstitutionState> = signal(
    this.institutionStore.formState()
  );

  protected readonly formData: FieldTree<InstitutionState> =
    this.buildForm();

  private formInitialized = false;

  constructor() {
    this.initializeData();
    this.watchFormChanges();
  }

  ngOnInit(): void {
    this.formRegistryService.register(
      'Institución',
      FORM_STATE_KEY,
      this.formData,
      this.form$()
    );
  }

  ngOnDestroy(): void {
    this.formRegistryService.unregister(FORM_STATE_KEY);
  }

  private initializeData(): void {
    effect(() => {
      const data = this.institutionStore.formState();

      if (!this.formInitialized) {
        this.form$.set(data);
        this.formInitialized = true;
      }
    });
  }

  private watchFormChanges(): void {
    effect(() => {
      this.institutionStore.updateForm(
        this.form$()
      );
    });
  }

  private buildForm(): FieldTree<InstitutionState> {
    return form<InstitutionState>(this.form$, (schema) => {
      applyInfoInstitutionValidators(schema);
    });
  }

  save(): void {
    if (this.formRegistryService.hasErrors()) {
      this.customMessageService.showFormErrors(
        this.formRegistryService.errors()
      );

      return;
    }

    this.saved.emit(
      this.form$()
    );
  }
}
