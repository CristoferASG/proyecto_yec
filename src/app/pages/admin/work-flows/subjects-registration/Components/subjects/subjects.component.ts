import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FieldTree, form, FormField, min, minLength, required, SchemaPathTree } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Button } from 'primeng/button';

import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { FormRegistryService } from '@utils/services/form-registry.service';
// INYECCIÓN REQUERIDA: Servicio de mensajes globales para desplegar el modal
import { CustomMessageService } from "@utils/services"; 

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
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService); // Agregado para el modal
    private readonly subjectsRegistrationStore = inject(SubjectsRegistrationStore);

    protected readonly form$ = signal(this.subjectsRegistrationStore.subjectData());
    protected readonly formData: FieldTree<SubjectData> = this.buildForm;

    // ==============================
    // Catálogos quemados (mock)
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
        effect(() => {
            this.subjectsRegistrationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
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
    // MÉTODO DE CAPTURA Y CONTROL DE ERRORES
    // ==============================
    async onSubmit(): Promise<void> {
        // Evalúa si el FormRegistryService detectó infracciones en las reglas de validación asignadas
        if (this.formRegistryService.hasErrors()) {
            // Muestra en pantalla el modal con la estructura de campos requeridos o inválidos
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return; // Detiene la ejecución
        }

        // Si pasa las validaciones, mostramos el estado actual recolectado por el Signal Store
        console.log('¡Formulario Válido! Datos capturados listos para el backend:', this.form$());
        
        // Aquí puedes opcionalmente lanzar una alerta de éxito simulada temporal
        //this.customMessageService.showSuccess('Datos de asignatura validados localmente con éxito.');
    }

    get buildForm() {
        return form<SubjectData>(this.form$, (schema) => {
            this.validateForm(schema);
        });
    }

    private validateForm(schema: SchemaPathTree<SubjectData>): void {
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