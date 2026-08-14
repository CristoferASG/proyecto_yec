import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {SchoolPeriodStore} from "../../school-period.store";
import {schoolPeriodFormValidation} from "./school-period-form.validation";
import {SchoolPeriodState} from "../../school-period.state";
import {InstitutionService} from "@modules/admin/work-flows/institution/institution.service";

const FORM_STATE_KEY = 'schoolPeriod';

/** Forma mínima de la institución (id + code + name) para poblar el <p-select>. */
interface InstitutionOption {
    id: string;
    code: string;
    name: string;
}

@Component({
    selector: 'app-school-period-form',
    imports: [
        InputText,
        Select,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './school-period-form.component.html',
    styles: [`
        /* Campo de fecha alineado al tema Sakai. */
        .custom-date-input {
            width: 100%;
            padding: 0.50rem 0.75rem;
            /* Borde por defecto (--surface-border). El #94a3b8 solo se usa si la variable no existe. */
            border: 1px solid var(--surface-border);
            border-radius: 6px;
            background: var(--surface-card);
            color: var(--text-color);
            font-family: var(--font-family);
            font-size: 1rem;
            transition: border-color 0.15s, box-shadow 0.15s;
        }
        .custom-date-input:hover {
            border-color: var(--primary-color);
        }
        .custom-date-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem var(--primary-color-emphasis);
        }
    `]
})
export class SchoolPeriodFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly schoolPeriodCreateStore = inject(SchoolPeriodStore);
    private readonly institutionService = inject(InstitutionService);

    /** Referencia directa al signal del store — cualquier cambio fluye sin copias. */
    protected readonly form$: WritableSignal<SchoolPeriodState> = this.schoolPeriodCreateStore.formState;
    protected readonly formData: FieldTree<SchoolPeriodState> = this.buildForm();

    protected readonly institutions = signal<InstitutionOption[]>([]);

    ngOnInit(): void {
        this.formRegistryService.register(
            'Periodo Lectivo',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
        this.loadInstitutions();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private loadInstitutions(): void {
        this.institutionService.findInstitutions(1, '').subscribe({
            next: (response) => {
                this.institutions.set(
                    (response.data as unknown[]).map((item: any) => ({
                        id: item.id,
                        code: item.code,
                        name: item.name
                    }))
                );
            }
        });
    }

    private buildForm(): FieldTree<SchoolPeriodState> {
        return form<SchoolPeriodState>(this.form$, (schema) => {
            schoolPeriodFormValidation(schema);
        });
    }
}