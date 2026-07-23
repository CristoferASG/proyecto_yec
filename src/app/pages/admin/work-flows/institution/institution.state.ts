export interface InstitutionState {
  name: string;
  denomination: string;
  shortName: string;

  cellphone: string;
  phone: string;
  email: string;
  web: string;

  logo: string;
  state: boolean;
  isVisible: boolean;

  code: string;
  codeSniese: string;
  acronym: string;
  slogan: string;
}

export interface InstitutionInterface extends InstitutionState {
  id: string;
}

export const INITIAL_INSTITUTION_STATE: InstitutionState = {
  name: '',
  denomination: '',
  shortName: '',

  cellphone: '',
  phone: '',
  email: '',
  web: 'https://',

  logo: '',
  state: false,
  isVisible: true,

  code: '',
  codeSniese: '',
  acronym: '',
  slogan: ''
};



