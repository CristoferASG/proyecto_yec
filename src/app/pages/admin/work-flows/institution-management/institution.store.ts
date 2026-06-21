import { computed, Injectable, signal } from "@angular/core";
import {
  InstitutionState,
  GeneralInfo,
  ContactInfo,
  ConfigurationInfo,
  InstitutionalInfo,
  INSTITUTION_FORM_INITIAL_STATE
} from "./institution.state";

@Injectable({ providedIn: 'root' })
export class InstitutionStore {
  // Estado principal del formulario usando Signal
  readonly formState = signal<InstitutionState>(INSTITUTION_FORM_INITIAL_STATE);
  
  // Estados de carga y errores
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  
  // Estados externos (catálogos, etc.)
  readonly states = signal<any[]>([]);
  
  // Señales computadas para secciones
  readonly generalInfo = computed(() => this.formState().generalInfo);
  readonly contactInfo = computed(() => this.formState().contactInfo);
  readonly configurationInfo = computed(() => this.formState().configurationInfo);
  readonly institutionalInfo = computed(() => this.formState().institutionalInfo);

  // Métodos de actualización por sección
  updateGeneralInfo(data: Partial<GeneralInfo>) {
    this.formState.update(state => ({
      ...state,
      generalInfo: { ...state.generalInfo, ...data }
    }));
  }

  updateContactInfo(data: Partial<ContactInfo>) {
    this.formState.update(state => ({
      ...state,
      contactInfo: { ...state.contactInfo, ...data }
    }));
  }

  updateConfigurationInfo(data: Partial<ConfigurationInfo>) {
    this.formState.update(state => ({
      ...state,
      configurationInfo: { ...state.configurationInfo, ...data }
    }));
  }

  updateInstitutionalInfo(data: Partial<InstitutionalInfo>) {
    this.formState.update(state => ({
      ...state,
      institutionalInfo: { ...state.institutionalInfo, ...data }
    }));
  }

  // Cargar datos completos (útil para edición)
  loadInstitution(data: InstitutionState) {
    this.formState.set(data);
  }

  // Resetear al estado inicial
  resetForm() {
    this.formState.set(INSTITUTION_FORM_INITIAL_STATE);
  }

  // Obtener valor actual del formulario
  getFormValue(): InstitutionState {
    return this.formState();
  }
}