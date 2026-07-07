import {Component, inject, OnInit, signal} from '@angular/core';

import {Button} from "primeng/button";

import {CustomMessageService} from "@utils/services";
import {CareerRegistrationStore} from '../../career-registration.store';
import {CareerRegistrationService} from "../../career-registration.service";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {CustomIcons} from "@utils/icons/custom-icons";
import {TableModule} from "primeng/table";
import {CareerInterface} from "@modules/admin/work-flows/career-registration/career-registration.state";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Paginator, PaginatorState} from "primeng/paginator";
import {INITIAL_PAGINATION, PaginationInterface} from "@utils/interfaces";
import {ButtonActionComponent} from "@utils/components/button-action/button-action.component";
import {MenuItem} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {registrationButtonAction} from "@utils/components/button-action/consts";
import {Router} from "@angular/router";
import {MY_ROUTES} from "@routes";

@Component({
    selector: 'app-career-list',
    imports: [
        Button,
        TableModule,
        InputText,
        InputGroup,
        Paginator,
        ButtonActionComponent,
        Tooltip
    ],
    templateUrl: './career-list.component.html'
})
export class CareerListComponent implements OnInit {
    private readonly formRegistryService = inject(FormRegistryService);
    protected readonly careerCreateStore = inject(CareerRegistrationStore);
    private readonly router = inject(Router);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly careerRegistrationService = inject(CareerRegistrationService);
    protected readonly CustomIcons = CustomIcons;

    protected items = signal<CareerInterface[]>([]);
    protected search = signal('');
    protected pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled: boolean = false;

    ngOnInit(): void {
        this.loadItems();
    }

    loadItems() {
        this.items.set([
            {
                "id": "1b8b2f6c-2d4a-4d6d-9d2d-8f4b7a1c1001",
                "code": "DSW",
                "shortName": "Desarrollo de Software",
                "logo": "https://picsum.photos/seed/dsw/200/200",
                "resolutionNumber": "RPC-SO-01-No.001-2026"
            },
            {
                "id": "2c9c3a7d-3e5b-4e7e-8e3e-9a5c8b2d2002",
                "code": "RDS",
                "shortName": "Redes y Telecomunicaciones",
                "logo": "https://picsum.photos/seed/redes/200/200",
                "resolutionNumber": "RPC-SO-02-No.015-2026"
            },
            {
                "id": "3d0d4b8e-4f6c-4f8f-9f4f-aa6d9c3e3003",
                "code": "MKT",
                "shortName": "Marketing Digital",
                "logo": "https://picsum.photos/seed/mkt/200/200",
                "resolutionNumber": "RPC-SO-03-No.028-2026"
            },
            {
                "id": "4e1e5c9f-5a7d-4090-a050-bb7e0d4f4004",
                "code": "ADM",
                "shortName": "Administración",
                "logo": "https://picsum.photos/seed/adm/200/200",
                "resolutionNumber": "RPC-SO-04-No.032-2026"
            },
            {
                "id": "5f2f6da0-6b8e-41a1-b161-cc8f1e505005",
                "code": "CON",
                "shortName": "Contabilidad",
                "logo": "https://picsum.photos/seed/conta/200/200",
                "resolutionNumber": "RPC-SO-05-No.041-2026"
            },
            {
                "id": "60307eb1-7c9f-42b2-c272-dd902f616006",
                "code": "TUR",
                "shortName": "Turismo",
                "logo": "https://picsum.photos/seed/turismo/200/200",
                "resolutionNumber": "RPC-SO-06-No.053-2026"
            },
            {
                "id": "71418fc2-8da0-43c3-d383-eea140727007",
                "code": "GAS",
                "shortName": "Gastronomía",
                "logo": "https://picsum.photos/seed/gastro/200/200",
                "resolutionNumber": "RPC-SO-07-No.064-2026"
            },
            {
                "id": "825290d3-9eb1-44d4-e494-ffb251838008",
                "code": "ENF",
                "shortName": "Enfermería",
                "logo": "https://picsum.photos/seed/enfermeria/200/200",
                "resolutionNumber": "RPC-SO-08-No.078-2026"
            },
            {
                "id": "9363a1e4-afc2-45e5-f5a5-10c362949009",
                "code": "MEC",
                "shortName": "Mecánica Automotriz",
                "logo": "https://picsum.photos/seed/mecanica/200/200",
                "resolutionNumber": "RPC-SO-09-No.082-2026"
            },
            {
                "id": "a474b2f5-b0d3-46f6-a6b6-21d473a5a010",
                "code": "ELE",
                "shortName": "Electricidad",
                "logo": "https://picsum.photos/seed/electricidad/200/200",
                "resolutionNumber": "RPC-SO-10-No.095-2026"
            }
        ])
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = {
            principalData: this.careerCreateStore.principalData(),
            secondaryData: this.careerCreateStore.secondaryData(),
        }

        console.log(payload);

        this.careerRegistrationService.register(payload).subscribe({
            next: (response) => {
            }
        });
    }

    buildButtonActions(item: any, index: number) {
        const actions: MenuItem[] = [];

        actions.push({
            ...registrationButtonAction,
            command: () => this.goToCreate(item)
        });

        actions.push({
            ...registrationButtonAction,
            command: () => this.goToCreate(item)
        });

        actions.push({
            ...registrationButtonAction,
            command: () => this.goToCreate(item)
        });

        actions.push({
            ...registrationButtonAction,
            command: () => this.goToCreate(item)
        });

        actions.push({
            ...registrationButtonAction,
            command: () => this.goToCreate(item)
        });


        this.buttonActions.set(actions);
    }

    goToCreate(item: any) {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute]);
    }

    findCareers(page = 1, search = null) {

    }

    onSelect({item, index}: { item: any; index: number }) {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    onPageChange(paginatorState: PaginatorState) {
        if (paginatorState?.page || paginatorState.page === 0) this.findCareers(paginatorState.page + 1);
    }
}
