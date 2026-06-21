export interface InstitutionState {
  generalInfo: GeneralInfo;
  contactInfo: ContactInfo;
  configurationInfo: ConfigurationInfo;
  institutionalInfo: InstitutionalInfo;
}

export interface GeneralInfo {
  name: string;
  denomination: string;
  shortName: string;
}

export interface ContactInfo {
  cellphone: string;
  phone: string;
  email: string;
  web: string;
}

export interface ConfigurationInfo {
  logo: string;
  state: string | null;
  isVisible: boolean;
}

export interface InstitutionalInfo {
  code: string;
  codeSniese: string;
  acronym: string;
  slogan: string;
}

export const INSTITUTION_FORM_INITIAL_STATE: InstitutionState = {
  generalInfo: {
    name: '',
    denomination: '',
    shortName: ''
  },
  contactInfo: {
    cellphone: '',
    phone: '',
    email: '',
    web: 'https://'
  },
  configurationInfo: {
    logo: '',
    state: null,
    isVisible: true
  },
  institutionalInfo: {
    code: '',
    codeSniese: '',
    acronym: '',
    slogan: ''
  }
};