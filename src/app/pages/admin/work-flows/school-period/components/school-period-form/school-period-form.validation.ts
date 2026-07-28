import {
    disabled,
    required,
    SchemaPathTree
} from '@angular/forms/signals';

import {SchoolPeriodData} from '../../school-period.state';

/**
 * Aplica los validadores del formulario de Periodo Lectivo sobre el schema de signals form.
 * `isViewMode` controla el disable global de campos en modo solo lectura.
 *
 * Nota: la validación cruzada "fin >= inicio" de cada par de fechas NO se hace aquí;
 * se materializa en el template con `[minDate]` en los p-datepicker de fin.
 */
export function applySchoolPeriodValidators(
    schema: SchemaPathTree<SchoolPeriodData>,
    isViewMode: () => boolean
): void {
    // El formField sincroniza el atributo "disabled" a partir del schema;
    // no se puede pisar con [disabled] en el template.
    disabled(schema, isViewMode);

    required(schema.code, {message: 'El código del periodo es requerido'});
    // codeSniese: opcional, sin validador.

    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.shortName, {message: 'El nombre corto es requerido'});

    required(schema.isVisible, {message: 'La visibilidad es requerida'});
    required(schema.state, {message: 'El estado es requerido'});

    required(schema.startedAt, {message: 'La fecha de inicio del periodo es requerida'});
    required(schema.endedAt, {message: 'La fecha de finalización del periodo es requerida'});

    required(schema.ordinaryStartedAt, {message: 'La fecha de inicio del periodo ordinario es requerida'});
    required(schema.ordinaryEndedAt, {message: 'La fecha de fin del periodo ordinario es requerida'});

    required(schema.extraOrdinaryStartedAt, {message: 'La fecha de inicio del periodo extraordinario es requerida'});
    required(schema.extraOrdinaryEndedAt, {message: 'La fecha de fin del periodo extraordinario es requerida'});

    required(schema.especialStartedAt, {message: 'La fecha de inicio del periodo especial es requerida'});
    required(schema.especialEndedAt, {message: 'La fecha de fin del periodo especial es requerida'});
}
