import {SchemaPathTree, maxLength, minLength, required} from '@angular/forms/signals';
import {SchoolPeriodState} from "@modules/admin/work-flows/school-period/school-period.state";

/** Validación reactiva del formulario de periodo lectivo (alineada al DTO del backend). */
export function schoolPeriodFormValidation(schema: SchemaPathTree<SchoolPeriodState>): void {
    // Institución: el DTO exige un UUID válido (error "debe ser un UUID válido" si falta).
    required(schema.institutionId, {message: 'Debe seleccionar una institución'});

    required(schema.code, {message: 'El código es requerido'});
    maxLength(schema.code, 30, {message: 'El código debe tener máximo 30 caracteres'});

    // Código SNIESE: alfanumérico (ej. 750713C02-A-1101). Opcional, solo longitud acotada.
    maxLength(schema.codeSniese, 30, {message: 'El código SNIESE debe tener máximo 30 caracteres'});

    required(schema.name, {message: 'El nombre es requerido'});
    maxLength(schema.name, 100, {message: 'El nombre debe tener máximo 100 caracteres'});

    required(schema.shortName, {message: 'El nombre corto es requerido'});
    minLength(schema.shortName, 2, {message: 'El nombre corto debe tener al menos 2 caracteres'});
    maxLength(schema.shortName, 30, {message: 'El nombre corto debe tener máximo 30 caracteres'});

    // Fechas del periodo lectivo.
    required(schema.startedAt, {message: 'La fecha de inicio es requerida'});
    required(schema.endedAt, {message: 'La fecha de fin es requerida'});
    required(schema.ordinaryStartedAt, {message: 'La fecha de inicio ordinaria es requerida'});
    required(schema.ordinaryEndedAt, {message: 'La fecha de fin ordinaria es requerida'});
    required(schema.extraOrdinaryStartedAt, {message: 'La fecha de inicio extraordinaria es requerida'});
    required(schema.extraOrdinaryEndedAt, {message: 'La fecha de fin extraordinaria es requerida'});
    required(schema.especialStartedAt, {message: 'La fecha de inicio especial es requerida'});
    required(schema.especialEndedAt, {message: 'La fecha de fin especial es requerida'});
}