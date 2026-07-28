import {Component, inject, input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {CareerService} from "../../career.service";
import {CareerState} from "../../career.state";
import {CareerStore} from '../../career.store';
import {
    CareerFormComponent
} from "@modules/admin/work-flows/career/components/career-form/career-form.component";

const FORM_STATE_KEY = 'career';

@Component({
    selector: 'app-career-container',
    imports: [
        CareerFormComponent,
        Button
    ],
    templateUrl: './career-container.component.html'
})
export class CareerContainerComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly careerStore = inject(CareerStore);
    protected readonly careerService = inject(CareerService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Carreras',
                    routerLink: MY_ROUTES.adminPages.career.absolute
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
            this.careerStore.resetForm();
        } else {
            this.loadData();
        }
    }

    /**
     * Carga el registro a editar/ver desde el backend.
     */
    private loadData() {
        this.careerService.findOneCareer(this.id()).subscribe({
            next: (response) => {
                this.careerStore.updateSection(FORM_STATE_KEY, response);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload: CareerState = {
            career: this.careerStore.career(),
        }

        console.log(payload);
        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: CareerState) {
        this.careerService.createCareer(payload).subscribe({
            next: (response) => {
            }
        });
    }

    private update(payload: CareerState) {
        this.careerService.updateCareer(this.id(), payload).subscribe({
            next: (response) => {
            }
        });
    }
}
