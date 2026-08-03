import {computed, Injectable, signal} from "@angular/core";
import {SignInState, INITIAL_STATE, SECTION_KEYS} from "./sign-in.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class SignInStore {
    readonly formState = signal<SignInState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly signInData = computed(() => this.formState().signInData);


    updateSection<K extends keyof SignInState>(
        section: K,
        data: Partial<SignInState[K]>
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

    private loadFromStorage(): SignInState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
