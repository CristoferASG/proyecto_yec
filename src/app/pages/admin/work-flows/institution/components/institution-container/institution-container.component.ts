import {Component, inject, input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {InstitutionService} from "../../institution.service";
import {InstitutionState} from "@modules/admin/work-flows/institution/institution.state";
import {InstitutionStore} from "../../institution.store";
import {InstitutionFormComponent} from "@modules/admin/work-flows/institution/components/institution-form/institution-form.component";

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
    private readonly router = inject(Router);
    protected readonly institutionCreateStore = inject(InstitutionStore);
    protected readonly institutionService = inject(InstitutionService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Listado de Instituciones',
                    routerLink: MY_ROUTES.adminPages.institution.absolute
                },
                {
                    label: 'Formulario',
                },
            ]
        );
    }

    ngOnInit() {
        this.institutionCreateStore.reset();
        if (this.id() !== 'new') this.loadData();
    }

    private loadData() {
        this.institutionService.findInstitution(this.id()).subscribe({
            next: (response) => {
                this.institutionCreateStore.updateState(response);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.institutionCreateStore.formState();

        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: InstitutionState) {
        this.institutionService.createInstitution(payload).subscribe({
            next: () => {
                this.router.navigateByUrl(MY_ROUTES.adminPages.institution.absolute);
            }
        });
    }

    private update(payload: InstitutionState) {
        this.institutionService.updateInstitution(this.id(), payload).subscribe({
            next: () => {
                this.router.navigateByUrl(MY_ROUTES.adminPages.institution.absolute);
            }
        });
    }
}
