import {Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField, SchemaPathTree} from '@angular/forms/signals';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';

import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';

import {CareerStore} from '../../career.store';
import {CareerData, AuxiliaryOption} from '../../career.state';
import {applyCareerValidators} from './career-form.validation';

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
    private readonly route = inject(ActivatedRoute);
    protected readonly careerStore = inject(CareerStore);

    // ==============================
    // Modo solo lectura (view): el form-section lee el query param ?mode=view
    // directamente de la ruta con toSignal (Angular 21), SIN necesidad de que
    // el container se lo reenvíe. Mantiene la estructura del modelo subject/
    // institution (<app-career-form/> sin bindings) y a la vez habilita el modo view.
    // ==============================
    private readonly queryParams = toSignal(this.route.queryParams, {initialValue: {} as Record<string, string>});
    protected readonly isViewMode = computed(() => this.queryParams()?.['mode'] === 'view');

    protected readonly form$: WritableSignal<CareerData> = signal(this.careerStore.career());
    protected readonly formData: FieldTree<CareerData> = this.buildForm();
    private formInitialized: boolean = false;

    // ==============================
    // Catálogos para los <p-select> del form.
    // Hoy están vacíos: se llenan desde el backend (CatalogueService por tipo
    // para modalidad/tipo; InstitutionService.findInstitution para institución).
    // Se dejan como signals listos para cablear cuando existan esos endpoints.
    // ==============================
    protected readonly modalities = signal<AuxiliaryOption[]>([]);

    protected readonly types = signal<AuxiliaryOption[]>([]);

    protected readonly institutions = signal<AuxiliaryOption[]>([]);

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
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    // ==============================
    // Lectura store -> form local: solo la PRIMERA vez, para no pisar la
    // edición del usuario cuando el store reemite. (Patrón de subject/principal-data.)
    // ==============================
    private initializeData(): void {
        effect(() => {
            const data = this.careerStore.career();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    // ==============================
    // Escritura form local -> store: cada cambio del usuario se publica al
    // store, que es la única fuente de verdad pública (lo lee el container
    // para el payload de create/update).
    // ==============================
    private watchFormChanges(): void {
        effect(() => {
            this.careerStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm(): FieldTree<CareerData> {
        return form<CareerData>(this.form$, (schema: SchemaPathTree<CareerData>) => {
            applyCareerValidators(schema, () => this.isViewMode());
        });
    }
}
