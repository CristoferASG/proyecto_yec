// ==============================
// Catálogos / Opciones auxiliares
// ==============================
export interface AuxiliaryOption {
    id: string;
    name: string;
}

// ==============================
// Datos del formulario (planos, sin anidación en el backend original)
// Campos derivados de CareerModel del front antiguo (excepto userId, que se
// resuelve en backend por sesión y no es campo de UI).
//
// NOTA: `state`/`isEnabled`/`isVisible` se omiten del modelo de formulario
// por decisión de dominio: el estado, la activación y la visibilidad los
// gestiona el backend (no son campos de UI que el usuario编辑). El back los
// define y los retorna en el DTO de listado/detalle.
// ==============================
export interface CareerData {
    code: string;
    codeSniese: string;
    name: string;
    shortName: string;
    degree: string;
    acronym: string;
    logo: string;
    resolutionNumber: string;
    modality: AuxiliaryOption | null;   // FK catálogo
    type: AuxiliaryOption | null;        // FK catálogo
    institution: AuxiliaryOption | null; // FK institución
}

// ==============================
// Estado del formulario con sección (para consistencia con subject/institution)
// ==============================
export interface CareerState {
    career: CareerData;
}

export const CAREER_DATA_KEYS = [
    'code',
    'codeSniese',
    'name',
    'shortName',
    'degree',
    'acronym',
    'logo',
    'resolutionNumber',
    'modality',
    'type',
    'institution',
] as const satisfies (keyof CareerData)[];

type SectionKeysMap = {
    [K in keyof CareerState]: readonly (keyof CareerState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    career: CAREER_DATA_KEYS,
};

export const CAREER_INITIAL_STATE: CareerState = {
    career: {
        code: '',
        codeSniese: '',
        name: '',
        shortName: '',
        degree: '',
        acronym: '',
        logo: '',
        resolutionNumber: '',
        modality: null,
        type: null,
        institution: null,
    },
};

// ==============================
// Modelo de dominio (item de lista / DTO retornado por el backend).
// ==============================
export interface CareerInterface extends CareerData {
    id: string;
}
