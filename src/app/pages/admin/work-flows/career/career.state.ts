import {CatalogueInterface} from "@utils/interfaces";

export interface CareerState {
    code: string;
    codeSniese: string;
    name: string;
    shortName: string;
    degree: string;
    acronym: string;
    modalityId: string;
    typeId: string;
    institutionId: string;
    resolutionNumber: string;
    logo: string;
}

/** Fila del listado (lo que devuelve GET /). */
export interface CareerInterface {
    id: string;
    code: string;
    name: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
    modalityId?: string;
    typeId?: string;
}

/** Opción del select de institución (para el formulario). */
export interface InstitutionInterface {
    id: string;
    code: string;
    name: string;
}

/** Detalle que devuelve GET /:id (incluye las relations que carga el backend). */
export interface CareerDetail extends CareerState {
    id: string;
    institution?: InstitutionInterface;
    modality?: CatalogueInterface;
    type?: CatalogueInterface;
}

export const INITIAL_STATE: CareerState = {
    code: '',
    codeSniese: '',
    name: '',
    shortName: '',
    degree: '',
    acronym: '',
    modalityId: '',
    typeId: '',
    institutionId: '',
    resolutionNumber: '',
    logo: '',
};

/** Whitelist de claves que el store puede recibir al hacer update. */
export const CAREER_KEYS = [
    'code',
    'codeSniese',
    'name',
    'shortName',
    'degree',
    'acronym',
    'modalityId',
    'typeId',
    'institutionId',
    'resolutionNumber',
    'logo',
] as const satisfies (keyof CareerState)[];
