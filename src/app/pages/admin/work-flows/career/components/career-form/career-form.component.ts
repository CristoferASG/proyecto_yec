import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {Select} from 'primeng/select';
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {CatalogueService} from "@utils/services";
import {CatalogueTypeEnum} from "@utils/enums";
import {CatalogueInterface} from "@utils/interfaces";
import {CareerStore} from "../../career.store";
import {careerFormValidation} from "./career-form.validation";
import {CareerState, InstitutionInterface} from "../../career.state";

const FORM_STATE_KEY = 'career';

@Component({
    selector: 'app-career-form',
    imports: [
        InputText,
        Select,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './career-form.component.html'
})
export class CareerFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerStore);
    protected readonly catalogueService = inject(CatalogueService);

    protected readonly form$: WritableSignal<CareerState> = signal(this.careerCreateStore.formState());
    protected readonly formData: FieldTree<CareerState> = this.buildForm();
    private formInitialized: boolean = false;

    // Catálogos para los p-select (opciones). El form guarda el ID en formData.modalityId/typeId/institutionId.
    protected readonly modalities = signal<CatalogueInterface[]>([]);
    protected readonly types = signal<CatalogueInterface[]>([]);
    // Institution se cableará cuando se refactorice el módulo de institution
    protected readonly institutions = signal<InstitutionInterface[]>([]);

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Carrera',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.loadCatalogues();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private initializeData(): void {
        effect(() => {
            const data = this.careerCreateStore.formState();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.careerCreateStore.updateState(this.form$());
        });
    }

    private buildForm(): FieldTree<CareerState> {
        return form<CareerState>(this.form$, (schema) => {
            careerFormValidation(schema)
        });
    }

    /** Carga los catálogos de modalidad y tipo de carrera desde sessionStorage. */
    private loadCatalogues(): void {
        this.modalities.set(this.catalogueService.findByType(CatalogueTypeEnum.careers_modality));
        this.types.set(this.catalogueService.findByType(CatalogueTypeEnum.careers_type));
    }
}
