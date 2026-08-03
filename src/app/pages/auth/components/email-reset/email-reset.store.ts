import {computed, Injectable, signal} from "@angular/core";
import {INITIAL_STATE, SECTION_KEYS} from "./email-reset.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";
import {EmailResetState} from "@modules/auth/components/email-reset/email-reset.state";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class EmailResetStore {
    readonly formState = signal<EmailResetState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly emailResetData = computed(() => this.formState().emailResetData);


    updateSection<K extends keyof EmailResetState>(
        section: K,
        data: Partial<EmailResetState[K]>
    ) {
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

    private loadFromStorage(): EmailResetState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
