import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormRegistryService } from "@/pages/admin/services/form-registry.service";
import {
  email,
  FieldTree,
  form,
  FormField,
  minLength,
  maxLength,
  pattern,
  required
} from "@angular/forms/signals";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { InputSwitch } from "primeng/inputswitch";
import { ErrorMessageDirective } from "@utils/directives/error-message.directive";
import {
  InstitutionState,
  INSTITUTION_FORM_INITIAL_STATE
} from "@/pages/admin/work-flows/institution-management/institution.state";

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [
    Button,
    InputText,
    InputSwitch,
    FormField,
    ErrorMessageDirective
  ],
  templateUrl: './institution-form.html'
})
export class InstitutionFormComponent implements OnInit, OnDestroy {
  private readonly formRegistryService = inject(FormRegistryService);

  protected form$ = signal<InstitutionState>(INSTITUTION_FORM_INITIAL_STATE);

  protected form: FieldTree<InstitutionState> = this.buildForm;

  // Opciones para el select de estados
  protected statesOptions = signal([
    { id: '1', name: 'Activo' },
    { id: '2', name: 'Inactivo' }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.formRegistryService.register(
      'institution',
      this.form,
      this.form$()
    );
  }

  ngOnDestroy(): void {
    this.formRegistryService.unregister('institution');
  }

  get buildForm() {
    return form(this.form$, (schema) => {
      this.validateForm(schema);
    });
  }

  private validateForm(schema: any): void {
    // General Info
    required(schema.generalInfo.name, { message: 'El nombre es requerido' });
    required(schema.generalInfo.denomination, { message: 'La denominación es requerida' });
    required(schema.generalInfo.shortName, { message: 'El nombre corto es requerido' });

    // Contact Info
    required(schema.contactInfo.cellphone, { message: 'El celular es requerido' });
    minLength(schema.contactInfo.cellphone, 10, { message: 'El celular debe tener 10 dígitos' });
    maxLength(schema.contactInfo.cellphone, 10, { message: 'El celular debe tener 10 dígitos' });

    required(schema.contactInfo.phone, { message: 'El teléfono es requerido' });
    minLength(schema.contactInfo.phone, 9, { message: 'El teléfono debe tener 9 dígitos' });
    maxLength(schema.contactInfo.phone, 9, { message: 'El teléfono debe tener 9 dígitos' });

    required(schema.contactInfo.email, { message: 'El email es requerido' });
    email(schema.contactInfo.email, { message: 'Ingresa un email válido' });

    pattern(schema.contactInfo.web, /^https?:\/\/.+/, { message: 'Ingresa una URL válida' });

    // Configuration Info
    required(schema.configurationInfo.state, { message: 'El estado es requerido' });

    // Institutional Info
    required(schema.institutionalInfo.code, { message: 'El código es requerido' });
    required(schema.institutionalInfo.acronym, { message: 'Las siglas son requeridas' });
  }

  async save() {
    const errors = await this.formRegistryService.getFormErrors();
    console.log('Errores del formulario:', errors);
  }
}