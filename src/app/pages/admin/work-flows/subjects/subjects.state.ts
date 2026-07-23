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
export interface SubjectData {
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

export interface SubjectState {
    subjectData: SubjectData;
}

export const SUBJECT_INITIAL_STATE: SubjectState = {
    subjectData: {
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
] as const satisfies (keyof SubjectData)[];

type SectionKeysMap = {
    [K in keyof SubjectState]: readonly (keyof SubjectState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    subjectData: SUBJECT_DATA_KEYS,
};