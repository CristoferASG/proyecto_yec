import { computed, Injectable, signal } from "@angular/core";
import {
    SubjectData,
    SubjectListItem,
    SubjectRegistrationState,
    SUBJECT_REGISTRATION_INITIAL_STATE
} from "./subjects-registration.state";

@Injectable({ providedIn: 'root' })
export class SubjectsRegistrationStore {
    // Estado principal del formulario usando Signal
    readonly formState = signal<SubjectRegistrationState>(SUBJECT_REGISTRATION_INITIAL_STATE);

    // Señal computada de la única sección del formulario
    readonly subjectData = computed(() => this.formState().subjectData);

    // ==============================
    // Datos quemados SOLO para maquetar la lista (fase de vista).
    // No representa un CRUD real; se reemplazará por datos del backend luego.
    // ==============================
    readonly items = signal<SubjectListItem[]>([
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

    // Actualiza la (única) sección del formulario
    updateSection(key: keyof SubjectRegistrationState, data: Partial<SubjectData>): void {
        this.formState.update(state => ({
            ...state,
            [key]: { ...state[key], ...data }
        }));
    }

    // Resetea el formulario al estado inicial
    resetForm(): void {
        this.formState.set(SUBJECT_REGISTRATION_INITIAL_STATE);
    }

    // Obtener valor actual del formulario
    getFormValue(): SubjectRegistrationState {
        return this.formState();
    }
}