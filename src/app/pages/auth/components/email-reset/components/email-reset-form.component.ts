import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {RippleModule} from 'primeng/ripple';
import {DatePickerModule} from 'primeng/datepicker';
import {MY_ROUTES} from '@routes';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from "@utils/services";
import {SignInService} from "@modules/auth/components/sign-in/sign-in.service";
import {form, FormField} from "@angular/forms/signals";
import {EmailResetStore} from "@modules/auth/components/email-reset/email-reset.store";
import {applyEmailResetValidation} from "@modules/auth/components/email-reset/components/email-reset.validation";
import {SecurityQuestion} from "@modules/auth/components/email-reset/email-reset.state";
import {CustomIcons} from "@utils/icons/custom-icons";

const FORM_STATE_KEY = 'emailResetData';

@Component({
    selector: 'app-email-reset-form',
    templateUrl: './email-reset-form.component.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, LabelDirective, ErrorMessageDirective, FormField]
})
export default class EmailResetFormComponent implements OnInit {
    public readonly allSecurityQuestions = signal<any[]>([]);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly store = inject(EmailResetStore);
    protected readonly service = inject(SignInService);
    protected readonly form$ = signal(this.store.emailResetData());
    protected readonly formData = this.buildForm();
    private formInitialized: boolean = false;
    protected readonly MY_ROUTES = MY_ROUTES;

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Reseteo de Correo',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.generateSecurityQuestions();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private initializeData(): void {
        effect(() => {
            const data = this.store.emailResetData();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.store.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm() {
        return form(this.form$, (schema) => {
            applyEmailResetValidation(schema)
        });
    }

    protected generateSecurityQuestions() {
        let selectedSecurityQuestions = this.allSecurityQuestions()
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

        selectedSecurityQuestions.forEach((sq) => this.addQuestion({
            code: sq.code,
            question: sq,
            answer: '',
        }));
    }

    protected addQuestion(question: SecurityQuestion): void {
        this.form$.update(data => ({
            ...data,
            securityQuestions: [
                ...data.securityQuestions,
                question,
            ],
        }));
    }

    protected readonly CustomIcons = CustomIcons;
}
