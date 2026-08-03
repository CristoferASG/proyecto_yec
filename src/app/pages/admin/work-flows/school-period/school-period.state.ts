export interface SchoolPeriodState {
    code: string;
    codeSniese: string;
    name: string;
    shortName: string;
    startedAt: string;
    endedAt: string;
    ordinaryStartedAt: string;
    ordinaryEndedAt: string;
    extraOrdinaryStartedAt: string;
    extraOrdinaryEndedAt: string;
    especialStartedAt: string;
    especialEndedAt: string;
    institutionId: string;
}

/** Fila del listado (lo que devuelve GET / — sin relaciones). */
export interface SchoolPeriodInterface {
    id: string;
    code: string;
    codeSniese: string;
    name: string;
    shortName: string;
    startedAt: string;
    endedAt: string;
    ordinaryStartedAt: string;
    ordinaryEndedAt: string;
    extraOrdinaryStartedAt: string;
    extraOrdinaryEndedAt: string;
    especialStartedAt: string;
    especialEndedAt: string;
}

/** Estado del periodo (se conserva: open/close). */
export interface SchoolPeriodStateDetail {
    id: string;
    code: string;
    name: string;
}

export const INITIAL_STATE: SchoolPeriodState = {
    code: '',
    codeSniese: '',
    name: '',
    shortName: '',
    startedAt: '',
    endedAt: '',
    ordinaryStartedAt: '',
    ordinaryEndedAt: '',
    extraOrdinaryStartedAt: '',
    extraOrdinaryEndedAt: '',
    especialStartedAt: '',
    especialEndedAt: '',
    institutionId: '',
};

/** Whitelist de claves que el store puede recibir al hacer update. */
export const SCHOOL_PERIOD_KEYS = [
    'code',
    'codeSniese',
    'name',
    'shortName',
    'startedAt',
    'endedAt',
    'ordinaryStartedAt',
    'ordinaryEndedAt',
    'extraOrdinaryStartedAt',
    'extraOrdinaryEndedAt',
    'especialStartedAt',
    'especialEndedAt',
    'institutionId',
] as const satisfies (keyof SchoolPeriodState)[];
