import {computed, Injectable, signal} from "@angular/core";
import {SECTION_KEYS, SchoolPeriodState, SCHOOL_PERIOD_INITIAL_STATE, SchoolPeriodInterface} from "./school-period.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

@Injectable({providedIn: 'root'})
export class SchoolPeriodStore {
    // Estado principal del formulario usando Signal
    readonly formState = signal<SchoolPeriodState>(SCHOOL_PERIOD_INITIAL_STATE);
    readonly formErrors = signal<Record<string, string[]>>({});

    // Señal computada de la sección del formulario
    readonly schoolPeriodData = computed(() => this.formState().schoolPeriodData);

    // ==============================
    // Datos quemados SOLO para maquetar la lista (fase de vista).
    // No representa un CRUD real; se reemplazará por datos del backend
    // de SchoolPeriodService.findSchoolPeriod() cuando exista el endpoint.
    // ==============================
    readonly items = signal<SchoolPeriodInterface[]>([
        {
            id: 'sp-0001',
            name: '2026-I',
            startedAt: new Date(2022, 8, 1),
            endedAt: new Date(2023, 1, 28),
            state: {id: 'open', name: 'Abierto', code: 'open'},
            isVisible: true
        },
        {
            id: 'sp-0002',
            name: '2025-II',
            startedAt: new Date(2022, 2, 1),
            endedAt: new Date(2022 , 7, 31),
            state: {id: 'close', name: 'Cerrado', code: 'close'},
            isVisible: true
        },
        {
            id: 'sp-0003',
            name: '2025-I',
            startedAt: new Date(2023, 8, 1),
            endedAt: new Date(2024, 1, 28),
            state: {id: 'close', name: 'Cerrado', code: 'close'},
            isVisible: true
        },
        {
            id: 'sp-0004',
            name: '2026-I',
            startedAt: new Date(2025, 2, 1),
            endedAt: new Date(2026, 7, 31),
            state: {id: 'close', name: 'Cerrado', code: 'close'},
            isVisible: false
        }
    ]);

    // Actualiza la sección del formulario con whitelisting de keys.
    updateSection<K extends keyof SchoolPeriodState>(
        section: K,
        data: Partial<SchoolPeriodState[K]>
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
        this.formState.set(SCHOOL_PERIOD_INITIAL_STATE);
    }

    // Obtener valor actual del formulario
    getFormValue(): SchoolPeriodState {
        return this.formState();
    }
}
