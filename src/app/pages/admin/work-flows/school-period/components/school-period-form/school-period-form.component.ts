import {Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField, SchemaPathTree} from '@angular/forms/signals';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

import {InputText} from 'primeng/inputtext';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';

import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';

import {SchoolPeriodStore} from '../../school-period.store';
import {CatalogueOption, SchoolPeriodData} from '../../school-period.state';
import {applySchoolPeriodValidators} from './school-period-form.validation';

const FORM_STATE_KEY = 'schoolPeriodData';

@Component({
    selector: 'app-school-period-form',
    imports: [
        InputText,
        ToggleSwitch,
        Select,
        DatePicker,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './school-period-form.component.html'
})
export class SchoolPeriodFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly route = inject(ActivatedRoute);
    protected readonly schoolPeriodStore = inject(SchoolPeriodStore);

    // ==============================
    // Modo solo lectura (view): el form-section lee el query param ?mode=view
    // directamente de la ruta con toSignal (Angular 21), SIN necesidad de que
    // el container se lo reenvíe. Mantiene la estructura del modelo subject/career
    // (<app-school-period-form/> sin bindings) y a la vez habilita el modo view.
    // ==============================
    private readonly queryParams = toSignal(this.route.queryParams, {initialValue: {} as Record<string, string>});
    protected readonly isViewMode = computed(() => this.queryParams()?.['mode'] === 'view');

    protected readonly form$: WritableSignal<SchoolPeriodData> = signal(this.schoolPeriodStore.schoolPeriodData());
    protected readonly formData: FieldTree<SchoolPeriodData> = this.buildForm();
    private formInitialized: boolean = false;

    // ==============================
    // Catálogo de estados (mock) mientras no hay conexión a backend para catálogos.
    // TODO (backend): cargar de CatalogueService.findByType(SCHOOL_PERIODS_STATE).
    // ==============================
    protected readonly states = signal<CatalogueOption[]>([
        {id: 'open', name: 'Abierto'},
        {id: 'close', name: 'Cerrado'}
    ]);

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

    // ==============================
    // Lectura store -> form local: solo la PRIMERA vez, para no pisar la
    // edición del usuario cuando el store reemite. (Patrón de subject/principal-data.)
    // ==============================
    private initializeData(): void {
        effect(() => {
            const data = this.schoolPeriodStore.schoolPeriodData();

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
            this.schoolPeriodStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm(): FieldTree<SchoolPeriodData> {
        return form<SchoolPeriodData>(this.form$, (schema: SchemaPathTree<SchoolPeriodData>) => {
            applySchoolPeriodValidators(schema, () => this.isViewMode());
        });
    }
}
