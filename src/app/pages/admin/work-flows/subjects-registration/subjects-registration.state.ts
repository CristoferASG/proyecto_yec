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

export interface SubjectRegistrationState {
    subjectData: SubjectData;
}

export const SUBJECT_REGISTRATION_INITIAL_STATE: SubjectRegistrationState = {
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

// ==============================
// Modelo para la lista (solo vista, datos quemados)
// ==============================
export interface SubjectListItem {
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