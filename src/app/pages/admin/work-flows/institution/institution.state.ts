export interface InstitutionState {
    acronym: string;
    code: string;
    codeSniese: string;
    denomination: string;
    name: string;
    shortName: string;
    cellphone: string;
    email: string;
    logo: string;
    phone: string;
    slogan: string;
    web: string;
}

/** Fila del listado (lo que devuelve GET / — sin relaciones). */
export interface InstitutionInterface {
    id: string;
    acronym: string;
    code: string;
    codeSniese: string;
    denomination: string;
    name: string;
    shortName: string;
    cellphone: string;
    email: string;
    logo: string;
    phone: string;
    slogan: string;
    web: string;
}

export const INITIAL_STATE: InstitutionState = {
    acronym: '',
    code: '',
    codeSniese: '',
    denomination: '',
    name: '',
    shortName: '',
    cellphone: '',
    email: '',
    logo: '',
    phone: '',
    slogan: '',
    web: '',
};

/** Whitelist de claves que el store puede recibir al hacer update. */
export const INSTITUTION_KEYS = [
    'acronym',
    'code',
    'codeSniese',
    'denomination',
    'name',
    'shortName',
    'cellphone',
    'email',
    'logo',
    'phone',
    'slogan',
    'web',
] as const satisfies (keyof InstitutionState)[];
