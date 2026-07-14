import {
  SchemaPathTree,
  email,
  maxLength,
  minLength,
  pattern,
  required
} from '@angular/forms/signals';

import {

  InstitutionState
} from '../../institution.state';

export function applyInfoInstitutionValidators(
  schema: SchemaPathTree<InstitutionState>
): void {
  required(schema.name, {
    message: 'El nombre es requerido'
  });

  required(schema.denomination, {
    message: 'La denominación es requerida'
  });

  required(schema.shortName, {
    message: 'El nombre corto es requerido'
  });

  required(schema.cellphone, {
    message: 'El celular es requerido'
  });

  minLength(schema.cellphone, 10, {
    message: 'El celular debe tener 10 dígitos'
  });

  maxLength(schema.cellphone, 10, {
    message: 'El celular debe tener 10 dígitos'
  });

  required(schema.phone, {
    message: 'El teléfono es requerido'
  });

  minLength(schema.phone, 9, {
    message: 'El teléfono debe tener 9 dígitos'
  });

  maxLength(schema.phone, 9, {
    message: 'El teléfono debe tener 9 dígitos'
  });

  required(schema.email, {
    message: 'El email es requerido'
  });

  email(schema.email, {
    message: 'Ingresa un email válido'
  });

  pattern(schema.web, /^https?:\/\/.+/, {
    message: 'Ingresa una URL válida'
  });

  required(schema.code, {
    message: 'El código es requerido'
  });

  required(schema.acronym, {
    message: 'Las siglas son requeridas'
  });
}

