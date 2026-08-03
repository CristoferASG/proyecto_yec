import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {SchoolPeriodStore} from "../../school-period.store";
import {schoolPeriodFormValidation} from "./school-period-form.validation";
import {SchoolPeriodState} from "../../school-period.state";

const FORM_STATE_KEY = 'schoolPeriod';

@Component({
    selector: 'app-school-period-form',
    imports: [
        InputText,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './school-period-form.component.html'
})
export class SchoolPeriodFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly schoolPeriodCreateStore = inject(SchoolPeriodStore);

    protected readonly form$: WritableSignal<SchoolPeriodState> = signal(this.schoolPeriodCreateStore.formState());
    protected readonly formData: FieldTree<SchoolPeriodState> = this.buildForm();
    private formInitialized: boolean = false;

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Periodo Lectivo',
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
            const data = this.schoolPeriodCreateStore.formState();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.schoolPeriodCreateStore.updateState(this.form$());
        });
    }

    private buildForm(): FieldTree<SchoolPeriodState> {
        return form<SchoolPeriodState>(this.form$, (schema) => {
            schoolPeriodFormValidation(schema)
        });
    }
}
