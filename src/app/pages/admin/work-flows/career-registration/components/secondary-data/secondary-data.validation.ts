import {required, SchemaPathTree,} from '@angular/forms/signals';
import {SecondaryData} from "@modules/admin/work-flows/career-registration/career-registration.state";
import {inject} from "@angular/core";
import {CareerRegistrationStore} from "@modules/admin/work-flows/career-registration/career-registration.store";

export function customValidation(schema: SchemaPathTree<SecondaryData>): void {
    const careerCreateStore = inject(CareerRegistrationStore);

    const x = ({valueOf}: any) => careerCreateStore.principalData().code === '1';
    const siTieneDiscapacidad = ({valueOf}: any) => valueOf(schema.code) === '1';

    required(schema.shortName, {
        message: 'El nombre corto es requerido',
        when: siTieneDiscapacidad
    });

    required(schema.code, {
        message: 'El nombre corto es requerido',
        when: x
    });
}
