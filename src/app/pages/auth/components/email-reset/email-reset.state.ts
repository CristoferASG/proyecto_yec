import {CatalogueInterface} from "@utils/interfaces";

export interface EmailResetState {
    emailResetData: EmailResetData;
}

export interface EmailResetData {
    email: string;
    securityQuestions: SecurityQuestion[];
}

export const INITIAL_STATE: EmailResetState = {
    emailResetData: {
        email: '',
        securityQuestions: [],
    }
};

export interface SecurityQuestion {
    code: '',
    question: CatalogueInterface,
    answer: ''
}

export const EMAIL_RESET_DATA_KEYS = ['email', 'securityQuestions'] as const satisfies (keyof EmailResetData)[];

type SectionKeysMap = {
    [K in keyof EmailResetState]: readonly (keyof EmailResetState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    emailResetData: EMAIL_RESET_DATA_KEYS
};
