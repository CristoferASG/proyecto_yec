import {Component, inject, input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {CareerService} from "../../career.service";
import {CareerState} from "@modules/admin/work-flows/career/career.state";
import {CareerStore} from '../../career.store';
import {CareerFormComponent} from "@modules/admin/work-flows/career/components/career-form/career-form.component";

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
    protected readonly careerCreateStore = inject(CareerStore);
    protected readonly careerRegistrationService = inject(CareerService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Listado de Carreras',
                    routerLink: MY_ROUTES.adminPages.career.absolute
                },
                {
                    label: 'Formulario',
                },
            ]
        );
    }

    ngOnInit() {
        if (this.id() !== 'new') this.loadData();
    }

    private loadData() {
        this.careerRegistrationService.findCareer(this.id()).subscribe({
            next: (response) => {
                // El backend trae institution/modality/type como relations (objetos);
                // el store guarda los IDs planos que acepta el DTO.
                this.careerCreateStore.updateState({
                    ...response,
                    modalityId: response.modality?.id ?? '',
                    typeId: response.type?.id ?? '',
                    institutionId: response.institution?.id ?? ''
                });
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.careerCreateStore.formState();

        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: CareerState) {
        this.careerRegistrationService.createCareer(payload).subscribe({
            next: (response) => {
            }
        });
    }

    private update(payload: CareerState) {
        this.careerRegistrationService.updateCareer(this.id(), payload).subscribe({
            next: (response) => {
            }
        });
    }
}