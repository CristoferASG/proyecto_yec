import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';

import {FieldTree, form, FormField, SchemaPathTree} from "@angular/forms/signals";
import {SecondaryData} from "../../career-registration.state";
import {InputText} from "primeng/inputtext";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {CareerRegistrationStore} from "../../career-registration.store";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {
    customValidation,
} from "@modules/admin/work-flows/career-registration/components/secondary-data/secondary-data.validation";
import {
    RequiredMarkerDirective
} from "@modules/admin/work-flows/career-registration/components/secondary-data/required-marker.directive";

const FORM_STATE_KEY = 'secondaryData';

@Component({
    selector: 'app-secondary-data',
    imports: [
        InputText,
        LabelDirective,
        FormField,
        ErrorMessageDirective,
        RequiredMarkerDirective
    ],
    templateUrl: './secondary-data.component.html'
})
export class SecondaryDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerRegistrationStore);
    protected readonly form$: WritableSignal<SecondaryData> = signal(this.careerCreateStore.secondaryData());
    protected readonly formData: FieldTree<SecondaryData> = this.buildForm;

    constructor() {
        effect(() => {
            this.careerCreateStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Secundarios',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    get buildForm() {
        return form<SecondaryData>(this.form$, (schema) => {
            this.validateForm(schema)
        });
    }

    private validateForm(schema: SchemaPathTree<SecondaryData>): void {
        customValidation(schema)
    }

    get codeField() {
        return this.formData.code;
    }

    get shortNameField() {
        return this.formData.shortName;
    }

    get logoField() {
        return this.formData.logo;
    }

    get resolutionNumberField() {
        return this.formData.resolutionNumber;
    }

    get institutionField() {
        return this.formData.institution;
    }
}
