import {SchemaPathTree, required} from '@angular/forms/signals';
import {InstitutionState} from "@modules/admin/work-flows/institution/institution.state";

/** Validación reactiva del formulario de institución (alineada al DTO del backend). */
export function institutionFormValidation(schema: SchemaPathTree<InstitutionState>): void {
    required(schema.acronym, {message: 'El acrónimo es requerido'});
    required(schema.code, {message: 'El código es requerido'});
    required(schema.codeSniese, {message: 'El código SNIESE es requerido'});
    required(schema.denomination, {message: 'La denominación es requerida'});
    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.shortName, {message: 'El nombre corto es requerido'});
    // cellphone, email, logo, phone, slogan, web: opcionales (coincide con el DTO)
}
