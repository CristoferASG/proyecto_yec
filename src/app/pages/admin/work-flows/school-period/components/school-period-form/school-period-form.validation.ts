import {SchemaPathTree, required} from '@angular/forms/signals';
import {SchoolPeriodState} from "@modules/admin/work-flows/school-period/school-period.state";

/** Validación reactiva del formulario de periodo lectivo (alineada al DTO del backend). */
export function schoolPeriodFormValidation(schema: SchemaPathTree<SchoolPeriodState>): void {
    required(schema.code, {message: 'El código es requerido'});
    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.shortName, {message: 'El nombre corto es requerido'});
    required(schema.startedAt, {message: 'La fecha de inicio es requerida'});
    required(schema.endedAt, {message: 'La fecha de fin es requerida'});
    required(schema.ordinaryStartedAt, {message: 'La fecha de inicio ordinaria es requerida'});
    required(schema.ordinaryEndedAt, {message: 'La fecha de fin ordinaria es requerida'});
    required(schema.extraOrdinaryStartedAt, {message: 'La fecha de inicio extraordinaria es requerida'});
    required(schema.extraOrdinaryEndedAt, {message: 'La fecha de fin extraordinaria es requerida'});
    required(schema.especialStartedAt, {message: 'La fecha de inicio especial es requerida'});
    required(schema.especialEndedAt, {message: 'La fecha de fin especial es requerida'});
    // codeSniese, institutionId: opcionales (coincide con el DTO)
}
