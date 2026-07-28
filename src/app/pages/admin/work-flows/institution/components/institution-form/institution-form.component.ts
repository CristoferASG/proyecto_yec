import {Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField, SchemaPathTree} from '@angular/forms/signals';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

import {InputText} from 'primeng/inputtext';

import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';

import {InstitutionStore} from '../../institution.store';
import {InstitutionData} from '../../institution.state';
import {applyInstitutionValidators} from './institution-form.validation';

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
    private readonly route = inject(ActivatedRoute);
    protected readonly institutionStore = inject(InstitutionStore);

    // ==============================
    // Modo solo lectura (view): el form-section lee el query param ?mode=view
    // directamente de la ruta con toSignal (Angular 21), SIN necesidad de que
    // el container se lo reenvíe. Mantiene la estructura del modelo subject/career
    // (<app-institution-form/> sin bindings) y a la vez habilita el modo view.
    // ==============================
    private readonly queryParams = toSignal(this.route.queryParams, {initialValue: {} as Record<string, string>});
    protected readonly isViewMode = computed(() => this.queryParams()?.['mode'] === 'view');

    protected readonly form$: WritableSignal<InstitutionData> = signal(this.institutionStore.institution());
    protected readonly formData: FieldTree<InstitutionData> = this.buildForm();
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

    // ==============================
    // Lectura store -> form local: solo la PRIMERA vez, para no pisar la
    // edición del usuario cuando el store reemite. (Patrón de subject/principal-data.)
    // ==============================
    private initializeData(): void {
        effect(() => {
            const data = this.institutionStore.institution();

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
            this.institutionStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm(): FieldTree<InstitutionData> {
        return form<InstitutionData>(this.form$, (schema: SchemaPathTree<InstitutionData>) => {
            applyInstitutionValidators(schema, () => this.isViewMode());
        });
    }
}