import {Injectable, signal} from "@angular/core";
import {INITIAL_STATE, SUBJECT_KEYS, SubjectState} from "./subject.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

/** Clave de persistencia ÚNICA del módulo subject (evita colisiones con otros módulos). */
const FORM_STATE_KEY = 'subjectFormState';

@Injectable({providedIn: 'root'})
export class SubjectStore {
    readonly formState = signal<SubjectState>(this.loadFromStorage());

    updateState(data: Partial<SubjectState>) {
        const filtered = pickKeys(data, SUBJECT_KEYS);

        this.formState.update(state => ({
            ...state,
            ...filtered
        }));
    }

    private loadFromStorage(): SubjectState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
