import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {SchoolPeriodService} from "../../school-period.service";
import {CatalogueOption, SCHOOL_PERIOD_INITIAL_STATE, SchoolPeriodData, SchoolPeriodState} from "../../school-period.state";
import {SchoolPeriodStore} from '../../school-period.store';
import {
    SchoolPeriodFormComponent
} from "@modules/admin/work-flows/school-period/components/school-period-form/school-period-form.component";

const FORM_STATE_KEY = 'schoolPeriodData';

@Component({
    selector: 'app-school-period-container',
    imports: [
        SchoolPeriodFormComponent,
        Button
    ],
    templateUrl: './school-period-container.component.html'
})
export class SchoolPeriodContainerComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly schoolPeriodStore = inject(SchoolPeriodStore);
    protected readonly schoolPeriodService = inject(SchoolPeriodService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    // ==============================
    // [MOCK TEMPORAL - REMOVIBLE]
    // Catálogo de estados quemado SOLO para el fallback del loadData() mientras no
    // exista el endpoint /school-period/:id. Cuando el backend esté conectado,
    // borrar este signal y todo el bloque marcado como MOCK en loadData().
    // (En el flujo real, el registro ya trae el `state` resuelto, así que este
    // mapeo no se necesita.)
    // ==============================
    private readonly states = signal<CatalogueOption[]>([
        {id: 'open', name: 'Abierto'},
        {id: 'close', name: 'Cerrado'}
    ]);

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Periodos Lectivos',
                    routerLink: MY_ROUTES.adminPages.schoolPeriod.absolute
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
            this.schoolPeriodStore.resetForm();
        } else {
            this.loadData();
        }
    }

    /**
     * Carga el registro a editar/ver.
     *
     * [MOCK TEMPORAL - REMOVIBLE]
     * Mientras el endpoint /school-period/:id no exista, se cargan los datos desde
     * los registros quemados del store (schoolPeriodStore.items) para poder probar
     * Ver/Editar en dev. El bloque marcado como MOCK se elimina junto con el
     * catálogo `states` de arriba cuando el backend esté conectado, dejando solo la
     * llamada real:
     *
     *   this.schoolPeriodService.findOneSchoolPeriod(this.id()).subscribe(
     *       next: (response) =>
     *           this.schoolPeriodStore.updateSection(FORM_STATE_KEY, response...));
     */
    private loadData() {
        // --- [INICIO MOCK TEMPORAL - REMOVIBLE] ---
        const mockItem = this.schoolPeriodStore.items().find(item => item.id === this.id());
        if (!mockItem) return;

        const state = this.states().find(option => option.id === mockItem.state?.id) ?? null;

        const toDate = (value: Date | string): Date | null => {
            if (!value) return null;
            return value instanceof Date ? value : new Date(value);
        };

        const loaded: SchoolPeriodData = {
            ...SCHOOL_PERIOD_INITIAL_STATE.schoolPeriodData,
            name: mockItem.name,
            state,
            startedAt: toDate(mockItem.startedAt),
            endedAt: toDate(mockItem.endedAt),
            isVisible: mockItem.isVisible
        };

        // Reseteamos el store primero para no mezclar con datos de una sesión anterior,
        // y luego aplicamos los datos cargados de forma atómica.
        this.schoolPeriodStore.resetForm();
        this.schoolPeriodStore.updateSection(FORM_STATE_KEY, loaded);
        // --- [FIN MOCK TEMPORAL - REMOVIBLE] ---

        // --- Llamada real (activa cuando exista el backend) ---
        // this.schoolPeriodService.findOneSchoolPeriod(this.id()).subscribe({
        //     next: (response) => {
        //         this.schoolPeriodStore.updateSection(FORM_STATE_KEY, ...);
        //     }
        // });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = {
            schoolPeriodData: this.schoolPeriodStore.schoolPeriodData(),
        }

        console.log(payload);
        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: SchoolPeriodState) {
        this.schoolPeriodService.createSchoolPeriod(payload).subscribe({
            next: (response) => {
            }
        });
    }

    private update(payload: SchoolPeriodState) {
        this.schoolPeriodService.updateSchoolPeriod(this.id(), payload).subscribe({
            next: (response) => {
            }
        });
    }
}
