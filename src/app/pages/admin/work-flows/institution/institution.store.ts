import { Injectable, signal } from '@angular/core';

import {
  INITIAL_INSTITUTION_STATE,
  InstitutionInterface,
  InstitutionState
} from './institution.state';

@Injectable({
  providedIn: 'root'
})
export class InstitutionStore {
  readonly formState = signal<InstitutionState>(
    INITIAL_INSTITUTION_STATE
  );

  updateForm(data: Partial<InstitutionState>): void {
    this.formState.update((state) => ({
      ...state,
      ...data
    }));
  }

  loadInstitution(data: InstitutionInterface): void {
    this.formState.set({
      name: data.name,
      denomination: data.denomination,
      shortName: data.shortName,

      cellphone: data.cellphone,
      phone: data.phone,
      email: data.email,
      web: data.web,

      logo: data.logo,
      state: data.state,
      isVisible: data.isVisible,

      code: data.code,
      codeSniese: data.codeSniese,
      acronym: data.acronym,
      slogan: data.slogan
    });
  }

  resetForm(): void {
    this.formState.set({
      ...INITIAL_INSTITUTION_STATE
    });
  }
}












