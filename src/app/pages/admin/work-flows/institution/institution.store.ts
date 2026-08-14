import {Injectable, signal} from "@angular/core";
import {INITIAL_STATE, INSTITUTION_KEYS, InstitutionState} from "./institution.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

/** Clave de persistencia ÚNICA del módulo institution (evita colisiones con otros módulos). */
const FORM_STATE_KEY = 'institutionFormState';

@Injectable({providedIn: 'root'})
export class InstitutionStore {
    readonly formState = signal<InstitutionState>(this.loadFromStorage());

    updateState(data: Partial<InstitutionState>) {
        const filtered = pickKeys(data, INSTITUTION_KEYS);

        this.formState.update(state => ({
            ...state,
            ...filtered
        }));
    }

    reset() {
        this.formState.set(structuredClone(INITIAL_STATE));
    }

    private loadFromStorage(): InstitutionState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
