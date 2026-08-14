import {SchemaPathTree, maxLength, minLength, required} from '@angular/forms/signals';
import {CareerState} from "@modules/admin/work-flows/career/career.state";

/** Validación reactiva del formulario de carrera (alineada al DTO del backend). */
export function careerFormValidation(schema: SchemaPathTree<CareerState>): void {
    required(schema.code, {message: 'El código es requerido'});
    required(schema.name, {message: 'El nombre es requerido'});

    // Nombre corto: requerido y mínimo 2 caracteres (alineado al DTO).
    required(schema.shortName, {message: 'El nombre corto es requerido'});
    minLength(schema.shortName, 2, {message: 'El nombre corto debe tener al menos 2 caracteres'});

    // Código SNIESE: alfanumérico con guiones (ej. 750713C02-A-1101). Solo longitud acotada.
    maxLength(schema.codeSniese, 30, {message: 'El código SNIESE debe tener máximo 30 caracteres'});

    // Número de resolución: formato tipo RPC-SO-26-NO.600-2020 (alfanumérico con guiones/puntos). Solo longitud.
    maxLength(schema.resolutionNumber, 30, {message: 'El número de resolución debe tener máximo 30 caracteres'});
}