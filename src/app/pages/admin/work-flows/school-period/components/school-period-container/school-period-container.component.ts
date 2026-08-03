import {Component, inject, input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {SchoolPeriodService} from "../../school-period.service";
import {SchoolPeriodState} from "@modules/admin/work-flows/school-period/school-period.state";
import {SchoolPeriodStore} from "../../school-period.store";
import {SchoolPeriodFormComponent} from "@modules/admin/work-flows/school-period/components/school-period-form/school-period-form.component";

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
    protected readonly schoolPeriodCreateStore = inject(SchoolPeriodStore);
    protected readonly schoolPeriodService = inject(SchoolPeriodService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Listado de Periodos Lectivos',
                    routerLink: MY_ROUTES.adminPages.schoolPeriod.absolute
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
        this.schoolPeriodService.findSchoolPeriod(this.id()).subscribe({
            next: (response) => {
                this.schoolPeriodCreateStore.updateState(response);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.schoolPeriodCreateStore.formState();

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
