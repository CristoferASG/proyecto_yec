import {SchemaPathTree, required} from '@angular/forms/signals';
import {CareerState} from "@modules/admin/work-flows/career/career.state";

/** Validación reactiva del formulario de carrera (alineada al DTO del backend). */
export function careerFormValidation(schema: SchemaPathTree<CareerState>): void {
    required(schema.code, {message: 'El código es requerido'});
    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.shortName, {message: 'El nombre corto es requerido'});
    // codeSniese, degree, acronym, modalityId, typeId, institutionId, resolutionNumber, logo: opcionales
    // (coincide con el DTO: code/name/shortName son los únicos requeridos; institutionId se guarda como null si no se selecciona)
}
