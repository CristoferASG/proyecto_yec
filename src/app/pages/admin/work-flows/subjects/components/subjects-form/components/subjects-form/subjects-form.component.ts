import {Component, computed, effect, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {FieldTree, form, FormField, SchemaPathTree} from '@angular/forms/signals';

import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {Select} from 'primeng/select';
import {MultiSelect} from 'primeng/multiselect';
import {Button} from 'primeng/button';

import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';
import {CustomMessageService} from '@utils/services';
import {BreadcrumbService} from '@layout/service/breadcrumb.service';
import {MY_ROUTES} from '@routes';

import {SubjectsStore} from '../../../../subjects.store';
import {SubjectsService} from '../../../../subjects.service';
import {CatalogueOption, SubjectData, SubjectOption} from '../../../../subjects.state';
import {applySubjectValidators} from '../../validators/subjects.validators';

const FORM_STATE_KEY = 'subjectData';

@Component({
    selector: 'app-subjects-form',
    imports: [
        InputText,
        InputNumber,
        ToggleSwitch,
        Select,
        MultiSelect,
        FormField,
        LabelDirective,
        ErrorMessageDirective,
        Button
    ],
    templateUrl: './subjects-form.component.html'
})
export class SubjectsFormComponent implements OnInit, OnDestroy {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly subjectsStore = inject(SubjectsStore);
    protected readonly subjectsService = inject(SubjectsService);

    // ==============================
    // Entradas provenientes de la ruta:
    // /subjects/:id            -> id() = 'new' o el id real (Editar)
    // /subjects/:id?mode=view  -> mode() = 'view' (Ver, solo lectura)
    // Requiere withComponentInputBinding() en la config del router (ya la usa career-form).
    // ==============================
    public readonly id = input.required<string>();
    public readonly mode = input<string>();

    protected readonly isViewMode = computed(() => this.mode() === 'view');

    protected readonly form$ = signal<SubjectData>(this.subjectsStore.subjectData());
    protected readonly formData: FieldTree<SubjectData> = this.buildForm();
    private formInitialized = false;

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

    protected readonly subjectsPrerequisites = signal<SubjectOption[]>([
        {id: '1', name: 'Programación I'},
        {id: '2', name: 'Matemáticas Discretas'}
    ]);

    protected readonly subjectsCorequisites = signal<SubjectOption[]>([
        {id: '3', name: 'Bases de Datos I'},
        {id: '4', name: 'Estructuras de Datos'}
    ]);

    constructor() {
        this.breadcrumbService.setItems([
            {label: 'Listado de Asignaturas', routerLink: [MY_ROUTES.adminPages.subject.absolute]},
            {label: 'Formulario'}
        ]);

        // Sincroniza cambios del form local hacia el store.
        effect(() => {
            this.subjectsStore.updateSection(FORM_STATE_KEY, this.form$());
        });

        // Sincroniza el store hacia el form local (carga en edición) la primera vez.
        effect(() => {
            const data = this.subjectsStore.subjectData();
            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    ngOnInit(): void {
        if (this.id() !== 'new') {
            this.loadData();
        }

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

    /**
     * Carga el registro a editar/ver desde el service real (SubjectsService.findSubject).
     * Mientras el endpoint no exista, se mantiene un respaldo temporal que busca el
     * registro en los datos quemados del store para poder probar Ver/Editar.
     */
    private loadData(): void {
        this.subjectsService.findSubject(this.id()).subscribe({
            next: (response) => {
                this.subjectsStore.updateSection(FORM_STATE_KEY, response as unknown as Partial<SubjectData>);
            },
            error: () => {
                // Respaldo temporal con datos quemados mientras no exista el endpoint.
                const mockItem = this.subjectsStore.items().find(item => item.id === this.id());
                if (!mockItem) return;

                const academicPeriod = this.academicPeriods().find(option => option.name === mockItem.academicPeriod) ?? null;
                const type = this.types().find(option => option.name === mockItem.type) ?? null;

                this.form$.update(current => ({
                    ...current,
                    academicPeriod,
                    type,
                    code: mockItem.code,
                    name: mockItem.name,
                    teacherHour: mockItem.teacherHour,
                    practicalHour: mockItem.practicalHour,
                    autonomousHour: mockItem.autonomousHour,
                    isVisible: mockItem.isVisible
                }));
            }
        });
    }

    async onSubmit(): Promise<void> {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.subjectsStore.subjectData();

        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: SubjectData): void {
        this.subjectsService.createSubject({subjectData: payload}).subscribe({
            next: () => {
            }
        });
    }

    private update(payload: SubjectData): void {
        this.subjectsService.updateSubject(this.id(), {subjectData: payload}).subscribe({
            next: () => {
            }
        });
    }

    private buildForm(): FieldTree<SubjectData> {
        return form<SubjectData>(this.form$, (schema: SchemaPathTree<SubjectData>) => {
            applySubjectValidators(schema, () => this.isViewMode());
        });
    }
}
