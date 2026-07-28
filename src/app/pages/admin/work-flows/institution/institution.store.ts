import {computed, Injectable, signal} from "@angular/core";
import {INSTITUTION_INITIAL_STATE, InstitutionState, SECTION_KEYS} from "./institution.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

@Injectable({providedIn: 'root'})
export class InstitutionStore {
    // Estado principal del formulario usando Signal
    readonly formState = signal<InstitutionState>(INSTITUTION_INITIAL_STATE);

    // Sección del formulario (clave 'institution')
    readonly institution = computed(() => this.formState().institution);

    // Actualiza la sección del formulario con whitelisting de keys.
    updateSection<K extends keyof InstitutionState>(
        section: K,
        data: Partial<InstitutionState[K]>
    ): void {
        const allowedKeys = SECTION_KEYS[section];
        const filtered = pickKeys(data, allowedKeys);

        this.formState.update(state => ({
            ...state,
            [section]: {
                ...state[section],
                ...filtered
            }
        }));
    }

    // Resetea el formulario al estado inicial
    resetForm(): void {
        this.formState.set(INSTITUTION_INITIAL_STATE);
    }

    // Obtener valor actual del formulario
    getFormValue(): InstitutionState {
        return this.formState();
    }
}