import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {InstitutionStore} from "../../institution.store";
import {institutionFormValidation} from "./institution-form.validation";
import {InstitutionState} from "../../institution.state";

const FORM_STATE_KEY = 'institution';

@Component({
    selector: 'app-institution-form',
    imports: [
        InputText,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './institution-form.component.html'
})
export class InstitutionFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly institutionCreateStore = inject(InstitutionStore);

    protected readonly form$: WritableSignal<InstitutionState> = signal(this.institutionCreateStore.formState());
    protected readonly formData: FieldTree<InstitutionState> = this.buildForm();
    private formInitialized: boolean = false;

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Institución',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private initializeData(): void {
        effect(() => {
            const data = this.institutionCreateStore.formState();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.institutionCreateStore.updateState(this.form$());
        });
    }

    private buildForm(): FieldTree<InstitutionState> {
        return form<InstitutionState>(this.form$, (schema) => {
            institutionFormValidation(schema)
        });
    }
}
