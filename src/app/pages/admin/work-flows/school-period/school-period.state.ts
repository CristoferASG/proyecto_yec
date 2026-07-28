// ==============================
// Catálogos / Opciones auxiliares
// ==============================
export interface CatalogueOption {
    id: string;
    name: string;
}

// ==============================
// Datos del formulario
// ==============================
export interface SchoolPeriodData {
    code: string;
    codeSniese: string;
    name: string;
    shortName: string;
    isVisible: boolean;
    state: CatalogueOption | null;

    // Rango del periodo lectivo
    startedAt: Date | null;
    endedAt: Date | null;

    // Rango de matrícula ordinaria
    ordinaryStartedAt: Date | null;
    ordinaryEndedAt: Date | null;

    // Rango de matrícula extraordinaria
    extraOrdinaryStartedAt: Date | null;
    extraOrdinaryEndedAt: Date | null;

    // Rango de matrícula especial
    especialStartedAt: Date | null;
    especialEndedAt: Date | null;
}

export interface SchoolPeriodState {
    schoolPeriodData: SchoolPeriodData;
}

export const SCHOOL_PERIOD_INITIAL_STATE: SchoolPeriodState = {
    schoolPeriodData: {
        code: '',
        codeSniese: '',
        name: '',
        shortName: '',
        isVisible: true,
        state: null,
        startedAt: null,
        endedAt: null,
        ordinaryStartedAt: null,
        ordinaryEndedAt: null,
        extraOrdinaryStartedAt: null,
        extraOrdinaryEndedAt: null,
        especialStartedAt: null,
        especialEndedAt: null,
    }
};

export const SCHOOL_PERIOD_DATA_KEYS = [
    'code',
    'codeSniese',
    'name',
    'shortName',
    'isVisible',
    'state',
    'startedAt',
    'endedAt',
    'ordinaryStartedAt',
    'ordinaryEndedAt',
    'extraOrdinaryStartedAt',
    'extraOrdinaryEndedAt',
    'especialStartedAt',
    'especialEndedAt'
] as const satisfies (keyof SchoolPeriodData)[];

type SectionKeysMap = {
    [K in keyof SchoolPeriodState]: readonly (keyof SchoolPeriodState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    schoolPeriodData: SCHOOL_PERIOD_DATA_KEYS,
};

// ==============================
// Modelo de dominio (item de lista / DTO retornado por el backend).
// Diferente del estado del formulario (SchoolPeriodData).
// ==============================
export interface SchoolPeriodInterface {
    id: string;
    name: string;
    startedAt: Date | string;
    endedAt: Date | string;
    state: { id: string; name: string; code: string };
    isVisible: boolean;
}
