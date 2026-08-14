import {Injectable, signal} from "@angular/core";
import {CAREER_KEYS, CareerState, INITIAL_STATE} from "./career.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

/** Clave de persistencia ÚNICA del módulo career (evita colisiones con otros módulos). */
const FORM_STATE_KEY = 'careerFormState';

@Injectable({providedIn: 'root'})
export class CareerStore {
    readonly formState = signal<CareerState>(this.loadFromStorage());

    updateState(data: Partial<CareerState>) {
        const filtered = pickKeys(data, CAREER_KEYS);

        this.formState.update(state => ({
            ...state,
            ...filtered
        }));
    }

    /** Limpia el estado del formulario a INITIAL_STATE (lo usa el container al entrar en modo "new"). */
    reset() {
        this.formState.set(structuredClone(INITIAL_STATE));
    }

    private loadFromStorage(): CareerState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}