import {min, max, minLength, required, SchemaPathTree} from '@angular/forms/signals';
import {SubjectState} from "@modules/admin/work-flows/subject/subject.state";

/** Validación reactiva del formulario de asignatura (alineada al DTO del backend). */
export function subjectFormValidation(schema: SchemaPathTree<SubjectState>): void {
    required(schema.academicPeriodId, {message: 'El periodo académico es requerido'});
    required(schema.typeId, {message: 'El tipo es requerido'});
    required(schema.code, {message: 'El código es requerido'});
    minLength(schema.code, 5, {message: 'El código debe tener al menos 5 caracteres'});
    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.autonomousHour, {message: 'La hora autónoma es requerida'});
    min(schema.autonomousHour, 0, {message: 'La hora autónoma debe ser mayor o igual a 0'});
    required(schema.practicalHour, {message: 'La hora práctica es requerida'});
    min(schema.practicalHour, 0, {message: 'La hora práctica debe ser mayor o igual a 0'});
    required(schema.teacherHour, {message: 'La hora del docente es requerida'});
    min(schema.teacherHour, 0, {message: 'La hora del docente debe ser mayor o igual a 0'});
    required(schema.scale, {message: 'La escala es requerida'});
    min(schema.scale, 0, {message: 'La escala debe ser mayor o igual a 0'});
    max(schema.scale, 1, {message: 'La escala debe ser menor o igual a 1'});
    // careerId, credits: opcionales (coincide con el DTO)
    // subjectPrerequisites / subjectCorequisites: NO existen en el DTO del backend (enviarlos = 422)
}
