import {computed, Injectable, signal} from "@angular/core";
import {SECTION_KEYS, SubjectInterface, SubjectState, SUBJECT_INITIAL_STATE} from "./subjects.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

@Injectable({providedIn: 'root'})
export class SubjectsStore {
    // Estado principal del formulario usando Signal
    readonly formState = signal<SubjectState>(SUBJECT_INITIAL_STATE);
    readonly formErrors = signal<Record<string, string[]>>({});

    // Señal computada de la sección del formulario
    readonly subjectData = computed(() => this.formState().subjectData);

    // ==============================
    // Datos quemados SOLO para maquetar la lista (fase de vista).
    // No representa un CRUD real; se reemplazará por datos del backend
    // de SubjectsService.findSubjects() cuando exista el endpoint.
    // ==============================
    readonly items = signal<SubjectInterface[]>([
        {
            id: '1f3a1c10-0000-0000-0000-000000000001',
            code: 'DSW-101',
            name: 'Programación I',
            academicPeriod: 'Primer Nivel',
            type: 'Obligatoria',
            teacherHour: 4,
            practicalHour: 2,
            autonomousHour: 3,
            isVisible: true
        },
        {
            id: '1f3a1c10-0000-0000-0000-000000000002',
            code: 'DSW-102',
            name: 'Matemáticas Discretas',
            academicPeriod: 'Primer Nivel',
            type: 'Obligatoria',
            teacherHour: 3,
            practicalHour: 1,
            autonomousHour: 2,
            isVisible: true
        },
        {
            id: '1f3a1c10-0000-0000-0000-000000000003',
            code: 'DSW-201',
            name: 'Estructuras de Datos',
            academicPeriod: 'Segundo Nivel',
            type: 'Obligatoria',
            teacherHour: 4,
            practicalHour: 2,
            autonomousHour: 3,
            isVisible: true
        },
        {
            id: '1f3a1c10-0000-0000-0000-000000000004',
            code: 'DSW-202',
            name: 'Bases de Datos I',
            academicPeriod: 'Segundo Nivel',
            type: 'Obligatoria',
            teacherHour: 3,
            practicalHour: 3,
            autonomousHour: 2,
            isVisible: true
        },
        {
            id: '1f3a1c10-0000-0000-0000-000000000005',
            code: 'DSW-301',
            name: 'Desarrollo Web Avanzado',
            academicPeriod: 'Tercer Nivel',
            type: 'Optativa',
            teacherHour: 4,
            practicalHour: 4,
            autonomousHour: 3,
            isVisible: false
        }
    ]);

    // Actualiza la sección del formulario con whitelisting de keys.
    updateSection<K extends keyof SubjectState>(
        section: K,
        data: Partial<SubjectState[K]>
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
        this.formState.set(SUBJECT_INITIAL_STATE);
    }

    // Obtener valor actual del formulario
    getFormValue(): SubjectState {
        return this.formState();
    }
}