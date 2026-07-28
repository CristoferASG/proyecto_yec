// ==============================
// Datos del formulario (planos, sin anidación en el backend original)
//
// NOTA: `isEnabled`/`isVisible` se omiten del modelo de formulario por
// decisión de dominio: la activación y la visibilidad las gestiona el backend
// (no son campos de UI que el usuario edición). El back los define y los
// retorna en el DTO de listado/detalle.
// ==============================
export interface InstitutionData {
  name: string;
  denomination: string;
  shortName: string;

  cellphone: string;
  phone: string;
  email: string;
  web: string;

  logo: string;

  code: string;
  codeSniese: string;
  acronym: string;
  slogan: string;
}

// ==============================
// Estado del formulario con sección (para consistencia con subject/school-period)
// ==============================
export interface InstitutionState {
  institution: InstitutionData;
}

export const INSTITUTION_DATA_KEYS = [
  'name',
  'denomination',
  'shortName',
  'cellphone',
  'phone',
  'email',
  'web',
  'logo',
  'code',
  'codeSniese',
  'acronym',
  'slogan',
] as const satisfies (keyof InstitutionData)[];

type SectionKeysMap = {
  [K in keyof InstitutionState]: readonly (keyof InstitutionState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
  institution: INSTITUTION_DATA_KEYS,
};

export const INSTITUTION_INITIAL_STATE: InstitutionState = {
  institution: {
    name: '',
    denomination: '',
    shortName: '',

    cellphone: '',
    phone: '',
    email: '',
    web: 'https://',

    logo: '',

    code: '',
    codeSniese: '',
    acronym: '',
    slogan: '',
  },
};

// ==============================
// Modelo de dominio (item de lista / DTO retornado por el backend).
// ==============================
export interface InstitutionInterface extends InstitutionData {
  id: string;
}