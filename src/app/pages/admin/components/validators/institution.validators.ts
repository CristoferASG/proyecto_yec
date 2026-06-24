// institution.validators.ts

import {
  required,
  minLength,
  maxLength,
  email,
  pattern
} from '@angular/forms/signals';

import { INSTITUTION_ERROR_MESSAGES } from '@/pages/admin/components/constants/instituion-error-messages';

export function applyInstitutionValidators(schema: any): void {

  // =========================
  // General Info
  // =========================

  required(
    schema.generalInfo.name,
    {
      message: INSTITUTION_ERROR_MESSAGES.GENERAL_INFO.NAME_REQUIRED
    }
  );

  required(
    schema.generalInfo.denomination,
    {
      message: INSTITUTION_ERROR_MESSAGES.GENERAL_INFO.DENOMINATION_REQUIRED
    }
  );

  required(
    schema.generalInfo.shortName,
    {
      message: INSTITUTION_ERROR_MESSAGES.GENERAL_INFO.SHORT_NAME_REQUIRED
    }
  );

  // =========================
  // Contact Info
  // =========================

  required(
    schema.contactInfo.cellphone,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.CELLPHONE_REQUIRED
    }
  );

  minLength(
    schema.contactInfo.cellphone,
    10,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.CELLPHONE_LENGTH
    }
  );

  maxLength(
    schema.contactInfo.cellphone,
    10,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.CELLPHONE_LENGTH
    }
  );

  required(
    schema.contactInfo.phone,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.PHONE_REQUIRED
    }
  );

  minLength(
    schema.contactInfo.phone,
    9,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.PHONE_LENGTH
    }
  );

  maxLength(
    schema.contactInfo.phone,
    9,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.PHONE_LENGTH
    }
  );

  required(
    schema.contactInfo.email,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.EMAIL_REQUIRED
    }
  );

  email(
    schema.contactInfo.email,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.EMAIL_INVALID
    }
  );

  pattern(
    schema.contactInfo.web,
    /^https?:\/\/.+/,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONTACT_INFO.WEB_INVALID
    }
  );

  // =========================
  // Configuration Info
  // =========================

  required(
    schema.configurationInfo.state,
    {
      message: INSTITUTION_ERROR_MESSAGES.CONFIGURATION_INFO.STATE_REQUIRED
    }
  );

  // =========================
  // Institutional Info
  // =========================

  required(
    schema.institutionalInfo.code,
    {
      message: INSTITUTION_ERROR_MESSAGES.INSTITUTIONAL_INFO.CODE_REQUIRED
    }
  );

  required(
    schema.institutionalInfo.acronym,
    {
      message: INSTITUTION_ERROR_MESSAGES.INSTITUTIONAL_INFO.ACRONYM_REQUIRED
    }
  );
}