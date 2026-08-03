import {required, SchemaPathTree,} from '@angular/forms/signals';
import {EmailResetData} from "@modules/auth/components/email-reset/email-reset.state";

export function applyEmailResetValidation(schema: SchemaPathTree<EmailResetData>): void {
    required(schema.email, {
        message: 'Correo electrónico'
    });
}

// public validateForm() {
//     const errors: string[] = [];
//
//     const invalid = this.securityQuestionsField.controls.some((ctrl) => ctrl.get('answer')?.invalid);
//
//     if (invalid) errors.push('Preguntas de seguridad');
//     if (this.emailField.invalid) errors.push('Correo');
//
//     if (errors.length > 0) {
//         this.form.markAllAsTouched();
//         this.customMessageService.showFormErrors(errors);
//         return false;
//     }
//
//     return true;
// }
