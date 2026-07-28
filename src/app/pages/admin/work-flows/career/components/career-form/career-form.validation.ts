import {
    disabled,
    required,
    SchemaPathTree
} from '@angular/forms/signals';

import {CareerData} from '../../career.state';

/**
 * Aplica los validadores del formulario de Carrera sobre el schema de signals form.
 * `isViewMode` controla el disable global de campos en modo solo lectura.
 */
export function applyCareerValidators(
    schema: SchemaPathTree<CareerData>,
    isViewMode: () => boolean
): void {
    // El formField sincroniza el atributo "disabled" a partir del schema;
    // no se puede pisar con [disabled] en el template.
    disabled(schema, isViewMode);

    required(schema.code, {message: 'El código es requerido'});
    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.shortName, {message: 'El nombre corto es requerido'});
    required(schema.degree, {message: 'El título es requerido'});
    required(schema.acronym, {message: 'Las siglas son requeridas'});
    required(schema.modality, {message: 'La modalidad es requerida'});
    required(schema.institution, {message: 'La institución es requerida'});
}
