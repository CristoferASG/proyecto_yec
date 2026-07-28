import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {SubjectService} from "../../subject.service";
import {CatalogueOption, SUBJECT_INITIAL_STATE, SubjectForm, SubjectState} from "../../subject.state";
import {SubjectStore} from '../../subject.store';
import {
    SubjectFormComponent
} from "@modules/admin/work-flows/subject/components/subject-form/subject-form.component";

@Component({
    selector: 'app-subject-container',
    imports: [
        SubjectFormComponent,
        Button
    ],
    templateUrl: './subject-container.component.html'
})
export class SubjectContainerComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly subjectStore = inject(SubjectStore);
    protected readonly subjectService = inject(SubjectService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    // ==============================
    // [MOCK TEMPORAL - REMOVIBLE]
    // Catálogos quemados SOLO para el fallback del loadData() mientras no
    // exista el endpoint /subject/:id. Cuando el backend esté conectado,
    // borrar estos dos signals y todo el bloque marcado como MOCK en loadData().
    // (En el flujo real, response.subjectForm ya trae los CatalogueOption
    // resueltos, así que este mapeo no se necesita.)
    // ==============================
    private readonly academicPeriods = signal<CatalogueOption[]>([
        {id: '1', name: 'Primer Nivel'},
        {id: '2', name: 'Segundo Nivel'},
        {id: '3', name: 'Tercer Nivel'}
    ]);

    private readonly types = signal<CatalogueOption[]>([
        {id: '1', name: 'Obligatoria'},
        {id: '2', name: 'Optativa'}
    ]);

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Listado de Asignaturas',
                    routerLink: MY_ROUTES.adminPages.subject.absolute
                },
                {
                    label: 'Formulario',
                },
            ]
        );
    }

    ngOnInit() {
        if (this.id() === 'new') {
            // Modo Crear: el store es un singleton compartido entre navegaciones,
            // así que forzamos el reseteo del formulario al estado inicial vacío.
            this.subjectStore.resetForm();
        } else {
            this.loadData();
        }
    }

    /**
     * Carga el registro a editar/ver.
     *
     * [MOCK TEMPORAL - REMOVIBLE]
     * Mientras el endpoint /subject/:id no exista, se cargan los datos desde
     * los registros quemados del store (subjectStore.items) para poder probar
     * Ver/Editar en dev. El bloque marcado como MOCK se elimina junto con los
     * catálogos de arriba cuando el backend esté conectado, dejando solo la
     * llamada real:
     *
     *   this.subjectService.findOneSubject(this.id()).subscribe(
     *       next: (response) =>
     *           this.subjectStore.updateSection('subjectForm', response.subjectForm));
     */
    private loadData() {
        // --- [INICIO MOCK TEMPORAL - REMOVIBLE] ---
        const mockItem = this.subjectStore.items().find(item => item.id === this.id());
        if (mockItem) {
            const academicPeriod = this.academicPeriods().find(option => option.name === mockItem.academicPeriod) ?? null;
            const type = this.types().find(option => option.name === mockItem.type) ?? null;

            const loaded: SubjectForm = {
                ...SUBJECT_INITIAL_STATE.subjectForm,
                academicPeriod,
                type,
                code: mockItem.code,
                name: mockItem.name,
                teacherHour: mockItem.teacherHour,
                practicalHour: mockItem.practicalHour,
                autonomousHour: mockItem.autonomousHour,
                isVisible: mockItem.isVisible
            };

            // Reseteamos el store primero para no mezclar con datos de una sesión anterior,
            // y luego aplicamos los datos cargados de forma atómica.
            this.subjectStore.resetForm();
            this.subjectStore.updateSection('subjectForm', loaded);
            return;
        }
        // --- [FIN MOCK TEMPORAL - REMOVIBLE] ---

        // --- Llamada real (activa cuando exista el backend) ---
        this.subjectService.findOneSubject(this.id()).subscribe({
            next: (response) => {
                this.subjectStore.updateSection('subjectForm', response.subjectForm);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = {
            subjectForm: this.subjectStore.subjectForm(),
        }

        console.log(payload);
        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: SubjectState) {
        this.subjectService.createSubject(payload).subscribe({
            next: (response) => {
            }
        });
    }

    private update(payload: SubjectState) {
        this.subjectService.updateSubject(this.id(), payload).subscribe({
            next: (response) => {
            }
        });
    }
}