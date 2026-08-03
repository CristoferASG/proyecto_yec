import {Component, inject, input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {SubjectService} from "../../subject.service";
import {SubjectState} from "@modules/admin/work-flows/subject/subject.state";
import {SubjectStore} from "../../subject.store";
import {SubjectFormComponent} from "@modules/admin/work-flows/subject/components/subject-form/subject-form.component";

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
    protected readonly subjectCreateStore = inject(SubjectStore);
    protected readonly subjectService = inject(SubjectService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

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
        if (this.id() !== 'new') this.loadData();
    }

    private loadData() {
        this.subjectService.findSubject(this.id()).subscribe({
            next: (response) => {
                this.subjectCreateStore.updateState(response);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.subjectCreateStore.formState();

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
