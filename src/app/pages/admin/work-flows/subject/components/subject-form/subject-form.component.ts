import {Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField, SchemaPathTree} from '@angular/forms/signals';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {Select} from 'primeng/select';
import {MultiSelect} from 'primeng/multiselect';

import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';

import {SubjectStore} from '../../subject.store';
import {SubjectForm} from '../../subject.state';
import {CatalogueOption, SubjectOption} from '../../subject.state';
import {applySubjectValidators} from './subject-form.validation';

const FORM_STATE_KEY = 'subjectForm';

@Component({
    selector: 'app-subject-form',
    imports: [
        InputText,
        InputNumber,
        ToggleSwitch,
        Select,
        MultiSelect,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly route = inject(ActivatedRoute);
    protected readonly subjectStore = inject(SubjectStore);

    // ==============================
    // Modo solo lectura (view): el form-section lee el query param ?mode=view
    // directamente de la ruta con toSignal (Angular 21), SIN necesidad de que
    // el container se lo reenvíe. Mantiene la estructura del modelo career
    // (<app-subject-form/> sin bindings) y a la vez habilita el modo view.
    // ==============================
    private readonly queryParams = toSignal(this.route.queryParams, {initialValue: {} as Record<string, string>});
    protected readonly isViewMode = computed(() => this.queryParams()?.['mode'] === 'view');

    protected readonly form$: WritableSignal<SubjectForm> = signal(this.subjectStore.subjectForm());
    protected readonly formData: FieldTree<SubjectForm> = this.buildForm();
    private formInitialized: boolean = false;

    // ==============================
    // Catálogos quemados (mock) mientras no hay conexión a backend para catálogos.
    // ==============================
    protected readonly academicPeriods = signal<CatalogueOption[]>([
        {id: '1', name: 'Primer Nivel'},
        {id: '2', name: 'Segundo Nivel'},
        {id: '3', name: 'Tercer Nivel'}
    ]);

    protected readonly types = signal<CatalogueOption[]>([
        {id: '1', name: 'Obligatoria'},
        {id: '2', name: 'Optativa'}
    ]);

    protected readonly subjectPrerequisites = signal<SubjectOption[]>([
        {id: '1', name: 'Programación I'},
        {id: '2', name: 'Matemáticas Discretas'}
    ]);

    protected readonly subjectCorequisites = signal<SubjectOption[]>([
        {id: '3', name: 'Bases de Datos I'},
        {id: '4', name: 'Estructuras de Datos'}
    ]);

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Asignatura',
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
    // edición del usuario cuando el store reemite. (Patrón de principal-data.)
    // ==============================
    private initializeData(): void {
        effect(() => {
            const data = this.subjectStore.subjectForm();

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
            this.subjectStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm(): FieldTree<SubjectForm> {
        return form<SubjectForm>(this.form$, (schema: SchemaPathTree<SubjectForm>) => {
            applySubjectValidators(schema, () => this.isViewMode());
        });
    }
}