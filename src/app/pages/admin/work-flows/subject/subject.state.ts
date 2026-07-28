// ==============================
// Catálogos / Opciones auxiliares
// ==============================
export interface CatalogueOption {
    id: string;
    name: string;
}

export interface SubjectOption {
    id: string;
    name: string;
    academicPeriod?: CatalogueOption;
}

// ==============================
// Datos del formulario
// ==============================

export interface SubjectState {
    subjectForm: SubjectForm;
}

export interface SubjectForm {
    id: string | null;
    academicPeriod: CatalogueOption | null;
    type: CatalogueOption | null;
    code: string;
    name: string;
    credits: number | null;
    teacherHour: number | null;
    practicalHour: number | null;
    autonomousHour: number | null;
    isEnabled: boolean;
    isVisible: boolean;
    subjectPrerequisites: SubjectOption[];
    subjectCorequisites: SubjectOption[];
}



export const SUBJECT_INITIAL_STATE: SubjectState = {
    subjectForm: {
        id: null,
        academicPeriod: null,
        type: null,
        code: '',
        name: '',
        credits: null,
        teacherHour: null,
        practicalHour: null,
        autonomousHour: null,
        isEnabled: true,
        isVisible: true,
        subjectPrerequisites: [],
        subjectCorequisites: [],
    }
};

export const SUBJECT_DATA_KEYS = [
    'academicPeriod',
    'type',
    'code',
    'name',
    'credits',
    'teacherHour',
    'practicalHour',
    'autonomousHour',
    'isEnabled',
    'isVisible',
    'subjectPrerequisites',
    'subjectCorequisites'
] as const satisfies (keyof SubjectForm)[];

type SectionKeysMap = {
    [K in keyof SubjectState]: readonly (keyof SubjectState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    subjectForm: SUBJECT_DATA_KEYS,
};

// ==============================
// Modelo de dominio (item de lista / DTO retornado por el backend).
// Diferente del estado del formulario (SubjectForm).
// ==============================
export interface SubjectInterface {
    id: string;
    code: string;
    name: string;
    academicPeriod: string;
    type: string;
    teacherHour: number;
    practicalHour: number;
    autonomousHour: number;
    isVisible: boolean;
}