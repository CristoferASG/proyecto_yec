import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { disabled, FieldTree, form, FormField, min, minLength, required, SchemaPathTree } from '@angular/forms/signals';

import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Button } from 'primeng/button';

import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { CustomMessageService } from '@utils/services';
import { BreadcrumbService } from '@layout/service/breadcrumb.service';
import { MY_ROUTES } from '@routes';

import { SubjectsRegistrationStore } from '../../subjects-registration.store';
import { CatalogueOption, SubjectData, SubjectOption } from '../../subjects-registration.state';

const FORM_STATE_KEY = 'subjectData';

@Component({
    selector: 'app-subjects',
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
    templateUrl: './subjects.component.html'
})
export class SubjectsComponent implements OnInit, OnDestroy {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly subjectsRegistrationStore = inject(SubjectsRegistrationStore);

    // ==============================
    // Entradas provenientes de la ruta:
    // /subjects/:id            -> id() = 'new' o el id real (Editar)
    // /subjects/:id?mode=view  -> mode() = 'view' (Ver, solo lectura)
    // Requiere withComponentInputBinding() en la config del router (ya la usa career-form).
    // ==============================
    public id = input.required<string>();
    public mode = input<string>();

    protected readonly isViewMode = computed(() => this.mode() === 'view');

    protected readonly form$ = signal(this.subjectsRegistrationStore.subjectData());
    protected readonly formData: FieldTree<SubjectData> = this.buildForm;

    // ==============================
    // Catálogos quemados (mock) mientras no hay conexión a backend.
    // ==============================
    protected readonly academicPeriods = signal<CatalogueOption[]>([
        { id: '1', name: 'Primer Nivel' },
        { id: '2', name: 'Segundo Nivel' },
        { id: '3', name: 'Tercer Nivel' }
    ]);

    protected readonly types = signal<CatalogueOption[]>([
        { id: '1', name: 'Obligatoria' },
        { id: '2', name: 'Optativa' }
    ]);

    protected readonly subjectsPrerequisites = signal<SubjectOption[]>([
        { id: '1', name: 'Programación I' },
        { id: '2', name: 'Matemáticas Discretas' }
    ]);

    protected readonly subjectsCorequisites = signal<SubjectOption[]>([
        { id: '3', name: 'Bases de Datos I' },
        { id: '4', name: 'Estructuras de Datos' }
    ]);

    constructor() {
        this.breadcrumbService.setItems([
            { label: 'Listado de Asignaturas', routerLink: [MY_ROUTES.adminPages.subject.absolute] },
            { label: 'Formulario' }
        ]);

        effect(() => {
            this.subjectsRegistrationStore.updateSection(FORM_STATE_KEY, this.form$());
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
     * TODO: reemplazar por this.subjectsHttpService.findOne(this.id()).subscribe(...)
     * cuando exista el servicio. Mientras tanto, busca el registro en los datos
     * quemados de la lista (subjectsRegistrationStore.items) para poder probar
     * "Ver" y "Editar" desde el listado sin backend real.
     */
    private loadData(): void {
        const mockItem = this.subjectsRegistrationStore.items().find(item => item.id === this.id());

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

    async onSubmit(): Promise<void> {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        // TODO: reemplazar por la llamada real al servicio cuando exista:
        // this.id() === 'new'
        //   ? this.subjectsHttpService.create(this.form$()).subscribe(...)
        //   : this.subjectsHttpService.update(this.id(), this.form$()).subscribe(...)
        console.log('¡Formulario válido! Datos listos para el backend:', this.form$());
    }

    get buildForm() {
        return form<SubjectData>(this.form$, (schema) => {
            this.validateForm(schema);
        });
    }

    private validateForm(schema: SchemaPathTree<SubjectData>): void {
        // El formField sincroniza el atributo "disabled" a partir del schema;
        // no se puede pisar con [disabled] en el template (por eso el error ngtsc).
        disabled(schema, () => this.isViewMode());

        required(schema.academicPeriod, { message: 'El periodo académico es requerido' });
        required(schema.type, { message: 'El tipo es requerido' });

        required(schema.code, { message: 'El código es requerido' });
        minLength(schema.code, 5, { message: 'El código debe tener al menos 5 caracteres' });

        required(schema.name, { message: 'El nombre es requerido' });

        required(schema.credits, { message: 'Los créditos son requeridos' });
        min(schema.credits, 0, { message: 'Los créditos no pueden ser negativos' });

        required(schema.teacherHour, { message: 'Las horas docentes son requeridas' });
        min(schema.teacherHour, 0, { message: 'Las horas docentes no pueden ser negativas' });

        required(schema.practicalHour, { message: 'Las horas prácticas son requeridas' });
        min(schema.practicalHour, 0, { message: 'Las horas prácticas no pueden ser negativas' });

        required(schema.autonomousHour, { message: 'Las horas autónomas son requeridas' });
        min(schema.autonomousHour, 0, { message: 'Las horas autónomas no pueden ser negativas' });
    }

    // ==============================
    // Getters de campos
    // ==============================
    get isEnabledField() { return this.formData.isEnabled; }
    get isVisibleField() { return this.formData.isVisible; }
    get academicPeriodField() { return this.formData.academicPeriod; }
    get typeField() { return this.formData.type; }
    get codeField() { return this.formData.code; }
    get nameField() { return this.formData.name; }
    get creditsField() { return this.formData.credits; }
    get teacherHourField() { return this.formData.teacherHour; }
    get practicalHourField() { return this.formData.practicalHour; }
    get autonomousHourField() { return this.formData.autonomousHour; }
    get subjectPrerequisitesField() { return this.formData.subjectPrerequisites; }
    get subjectCorequisitesField() { return this.formData.subjectCorequisites; }
}