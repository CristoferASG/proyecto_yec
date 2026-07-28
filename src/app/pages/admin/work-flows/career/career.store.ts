import {computed, Injectable, signal} from "@angular/core";
import {CAREER_INITIAL_STATE, CareerState, SECTION_KEYS} from "./career.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

@Injectable({providedIn: 'root'})
export class CareerStore {
    // Estado principal del formulario usando Signal
    readonly formState = signal<CareerState>(CAREER_INITIAL_STATE);

    // Sección del formulario (clave 'career')
    readonly career = computed(() => this.formState().career);

    // Actualiza la sección del formulario con whitelisting de keys.
    updateSection<K extends keyof CareerState>(
        section: K,
        data: Partial<CareerState[K]>
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
        this.formState.set(CAREER_INITIAL_STATE);
    }

    // Obtener valor actual del formulario
    getFormValue(): CareerState {
        return this.formState();
    }
}
