import {required, SchemaPathTree,} from '@angular/forms/signals';
import {SignInData} from "@modules/auth/components/sign-in/sign-in.state";

export function applySignInValidation(schema: SchemaPathTree<SignInData>): void {
    required(schema.username, {
        message: 'Nombe de Usuario'
    });

    required(schema.password, {
        message: 'Contraseña',
    });
}
