import {Injectable, signal} from "@angular/core";
import {INITIAL_STATE, SCHOOL_PERIOD_KEYS, SchoolPeriodState} from "./school-period.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

/** Clave de persistencia ÚNICA del módulo school-period (evita colisiones con otros módulos). */
const FORM_STATE_KEY = 'schoolPeriodFormState';

@Injectable({providedIn: 'root'})
export class SchoolPeriodStore {
    readonly formState = signal<SchoolPeriodState>(this.loadFromStorage());

    updateState(data: Partial<SchoolPeriodState>) {
        const filtered = pickKeys(data, SCHOOL_PERIOD_KEYS);

        this.formState.update(state => ({
            ...state,
            ...filtered
        }));
    }

    /** Limpia el estado del formulario a INITIAL_STATE (lo usa el container al entrar en modo "new"). */
    reset() {
        this.formState.set(structuredClone(INITIAL_STATE));
    }

    private loadFromStorage(): SchoolPeriodState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
