import {SchemaPathTree, email, maxLength, minLength, pattern, required} from '@angular/forms/signals';
import {InstitutionState} from "@modules/admin/work-flows/institution/institution.state";

// Validación reactiva del formulario de institución 
export function institutionFormValidation(schema: SchemaPathTree<InstitutionState>): void {
    required(schema.acronym, {message: 'El acrónimo es requerido'});
    required(schema.code, {message: 'El código es requerido'});
    required(schema.codeSniese, {message: 'El código SNIESE es requerido'});
    required(schema.denomination, {message: 'La denominación es requerida'});
    required(schema.name, {message: 'El nombre es requerido'});
    required(schema.shortName, {message: 'El nombre corto es requerido'});

    // Teléfono convencional: 9 dígitos numéricos 
    minLength(schema.phone, 9, {message: 'El teléfono debe tener 9 dígitos numéricos'});
    maxLength(schema.phone, 9, {message: 'El teléfono debe tener 9 dígitos numéricos'});
    pattern(schema.phone, /^[0-9]+$/, {message: 'El teléfono solo admite números'});

    // Celular: 10 dígitos numéricos 
    minLength(schema.cellphone, 10, {message: 'El celular debe tener 10 dígitos numéricos'});
    maxLength(schema.cellphone, 10, {message: 'El celular debe tener 10 dígitos numéricos'});
    pattern(schema.cellphone, /^[0-9]+$/, {message: 'El celular solo admite números'});

    // Correo electrónico 
    email(schema.email, {message: 'Ingrese un correo electrónico válido'});

    // Sitio web: URL con protocolo (opcional)
    pattern(schema.web, /^https?:\/\/.+/, {message: 'Ingrese una URL válida  (ej. https://yavirac.edu.ec)'});
}
