import {Component, inject, input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {InstitutionService} from "../../institution.service";
import {InstitutionState} from "../../institution.state";
import {InstitutionStore} from '../../institution.store';
import {
    InstitutionFormComponent
} from "@modules/admin/work-flows/institution/components/institution-form/institution-form.component";

const FORM_STATE_KEY = 'institution';

@Component({
    selector: 'app-institution-container',
    imports: [
        InstitutionFormComponent,
        Button
    ],
    templateUrl: './institution-container.component.html'
})
export class InstitutionContainerComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly institutionStore = inject(InstitutionStore);
    protected readonly institutionService = inject(InstitutionService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Instituciones',
                    routerLink: MY_ROUTES.adminPages.institution.absolute
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
            this.institutionStore.resetForm();
        } else {
            this.loadData();
        }
    }

    /**
     * Carga el registro a editar/ver desde el backend.
     */
    private loadData() {
        this.institutionService.findOneInstitution(this.id()).subscribe({
            next: (response) => {
                this.institutionStore.updateSection(FORM_STATE_KEY, response);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload: InstitutionState = {
            institution: this.institutionStore.institution(),
        }

        console.log(payload);
        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: InstitutionState) {
        this.institutionService.createInstitution(payload).subscribe({
            next: (response) => {
            }
        });
    }

    private update(payload: InstitutionState) {
        this.institutionService.updateInstitution(this.id(), payload).subscribe({
            next: (response) => {
            }
        });
    }
}
