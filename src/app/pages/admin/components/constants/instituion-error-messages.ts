// institution-error-messages.ts

export const INSTITUTION_ERROR_MESSAGES = {
  GENERAL_INFO: {
    NAME_REQUIRED: 'El nombre es requerido',
    DENOMINATION_REQUIRED: 'La denominación es requerida',
    SHORT_NAME_REQUIRED: 'El nombre corto es requerido'
  },

  CONTACT_INFO: {
    CELLPHONE_REQUIRED: 'El celular es requerido',
    CELLPHONE_LENGTH: 'El celular debe tener 10 dígitos',

    PHONE_REQUIRED: 'El teléfono es requerido',
    PHONE_LENGTH: 'El teléfono debe tener 9 dígitos',

    EMAIL_REQUIRED: 'El email es requerido',
    EMAIL_INVALID: 'Ingresa un email válido',

    WEB_INVALID: 'Ingresa una URL válida'
  },

  CONFIGURATION_INFO: {
    STATE_REQUIRED: 'El estado es requerido'
  },

  INSTITUTIONAL_INFO: {
    CODE_REQUIRED: 'El código es requerido',
    ACRONYM_REQUIRED: 'Las siglas son requeridas'
  }
} as const;