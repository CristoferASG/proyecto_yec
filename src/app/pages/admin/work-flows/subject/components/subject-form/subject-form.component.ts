import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {CatalogueService} from "@utils/services";
import {CareerService} from "@modules/admin/work-flows/career/career.service";
import {CatalogueTypeEnum} from "@utils/enums";
import {CatalogueInterface} from "@utils/interfaces";
import {SubjectStore} from "../../subject.store";
import {subjectFormValidation} from "./subject-form.validation";
import {SubjectState} from "../../subject.state";
import {CareerInterface} from "@modules/admin/work-flows/career/career.state";

const FORM_STATE_KEY = 'subject';

@Component({
    selector: 'app-subject-form',
    imports: [
        InputText,
        Select,
        InputNumber,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly subjectCreateStore = inject(SubjectStore);
    protected readonly catalogueService = inject(CatalogueService);
    private readonly careerService = inject(CareerService);

    /** El form$ apunta DIRECTAMENTE al signal del store (no es una copia).
     *  Esto garantiza que cada carga de datos del back sobreescriba el estado
     *  y que no se quede "pegado" con el dato de un registro anterior. */
    protected readonly form$: WritableSignal<SubjectState> = this.subjectCreateStore.formState;
    protected readonly formData: FieldTree<SubjectState> = this.buildForm();

    // Catálogos para los p-select (opciones). El form guarda el ID en formData.academicPeriodId/typeId/careerId.
    protected readonly academicPeriods = signal<CatalogueInterface[]>([]);
    protected readonly types = signal<CatalogueInterface[]>([]);
    protected readonly careers = signal<CareerInterface[]>([]);

    ngOnInit(): void {
        this.formRegistryService.register(
            'Asignatura',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.loadCatalogues();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private buildForm(): FieldTree<SubjectState> {
        return form<SubjectState>(this.form$, (schema) => {
            subjectFormValidation(schema)
        });
    }

    /** Carga los catálogos de periodo académico y tipo, y las carreras. */
    private loadCatalogues(): void {
        this.academicPeriods.set(this.catalogueService.findByType(CatalogueTypeEnum.academic_period));
        this.types.set(this.catalogueService.findByType(CatalogueTypeEnum.subject_type));

        this.careerService.findCareers(1, '').subscribe({
            next: (response) => {
                this.careers.set(response.data);
            }
        });
    }
}
