import {Component, inject, input, OnInit, output} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {CustomIcons} from "@utils/icons/custom-icons";
import {AppService, CustomMessageService} from "@utils/services";
import EmailResetFormComponent from "@modules/auth/components/email-reset/components/email-reset-form.component";
import {EmailResetService} from "@modules/auth/components/email-reset/email-reset.service";
import {EmailResetStore} from "@modules/auth/components/email-reset/email-reset.store";
import {EmailResetState} from "@modules/auth/components/email-reset/email-reset.state";

@Component({
    selector: 'app-email-reset-container',
    imports: [
        Button,
        EmailResetFormComponent
    ],
    template:
        `
            <app-email-reset-form/>

            <div class="custom-form-card">
                <div class="custom-form-grid md:grid-cols-12">
                    <div class="custom-form-field md:col-span-6 md:col-start-4">
                        <p-button
                            type="submit"
                            label="Ingresar"
                            styleClass="w-full"
                            [raised]="true"
                            [icon]="CustomIcons.ARROW_RIGHT_TO_BRACKET_SOLID"
                            [loading]="appService.loading()"
                            (onClick)="onSubmit()">
                        </p-button>
                    </div>
                </div>
            </div>
        `
})
export class CareerFormComponent implements OnInit {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected onSubmitted = output<string>();
    public userId = input.required<string>();

    protected readonly store = inject(EmailResetStore);
    protected readonly service = inject(EmailResetService);
    protected readonly appService = inject(AppService);
    protected readonly CustomIcons = CustomIcons;

    constructor() {

    }

    ngOnInit() {

    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload:EmailResetState = {
            emailResetData: this.store.emailResetData(),
        }

        this.verifySecurityQuestionsAndResetEmail(payload);
    }

    private verifySecurityQuestionsAndResetEmail(payload: EmailResetState) {
        this.service.verifySecurityQuestionsAndResetEmail(this.userId(), payload).subscribe({
            next: (_) => {
                this.onSubmitted.emit(payload.emailResetData.email);
            }
        });
    }
}
