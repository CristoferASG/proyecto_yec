export interface SignInState {
    signInData: SignInData;
}

export interface SignInData {
    username: string;
    password: string;
}

export const INITIAL_STATE: SignInState = {
    signInData: {
        username: '',
        password: '',
    }
};

export const SIGN_IN_DATA_KEYS = ['username', 'password'] as const satisfies (keyof SignInData)[];

type SectionKeysMap = {
    [K in keyof SignInState]: readonly (keyof SignInState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    signInData: SIGN_IN_DATA_KEYS,
};
