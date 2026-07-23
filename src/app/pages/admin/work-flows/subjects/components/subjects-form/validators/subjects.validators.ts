import {
    disabled,
    min,
    minLength,
    required,
    SchemaPathTree
} from '@angular/forms/signals';

import {SubjectData} from '../../../subjects.state';

/**
 * Aplica los validadores del formulario de Asignatura sobre el schema de signals form.
 * `isViewMode` controla el disable global de campos en modo solo lectura.
 */
export function applySubjectValidators(
    schema: SchemaPathTree<SubjectData>,
    isViewMode: () => boolean
): void {
    // El formField sincroniza el atributo "disabled" a partir del schema;
    // no se puede pisar con [disabled] en el template.
    disabled(schema, isViewMode);

    required(schema.academicPeriod, {message: 'El periodo académico es requerido'});
    required(schema.type, {message: 'El tipo es requerido'});

    required(schema.code, {message: 'El código es requerido'});
    minLength(schema.code, 5, {message: 'El código debe tener al menos 5 caracteres'});

    required(schema.name, {message: 'El nombre es requerido'});

    required(schema.credits, {message: 'Los créditos son requeridos'});
    min(schema.credits, 0, {message: 'Los créditos no pueden ser negativos'});

    required(schema.teacherHour, {message: 'Las horas docentes son requeridas'});
    min(schema.teacherHour, 0, {message: 'Las horas docentes no pueden ser negativas'});

    required(schema.practicalHour, {message: 'Las horas prácticas son requeridas'});
    min(schema.practicalHour, 0, {message: 'Las horas prácticas no pueden ser negativas'});

    required(schema.autonomousHour, {message: 'Las horas autónomas son requeridas'});
    min(schema.autonomousHour, 0, {message: 'Las horas autónomas no pueden ser negativas'});
}