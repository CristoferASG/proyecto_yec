import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {RippleModule} from 'primeng/ripple';
import {DatePickerModule} from 'primeng/datepicker';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {form, FormField} from "@angular/forms/signals";
import {SignInStore} from "@modules/auth/components/sign-in/sign-in.store";
import {SignInService} from "@modules/auth/components/sign-in/sign-in.service";
import {SignInData} from "@modules/auth/components/sign-in/sign-in.state";
import {applySignInValidation} from "@modules/auth/components/sign-in/components/sign-in-data.validation";
import {CustomIcons} from "@utils/icons/custom-icons";

const FORM_STATE_KEY = 'signInData';
@Component({
    selector: 'app-sign-in-form',
    templateUrl: './sign-in-form.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, LabelDirective, ErrorMessageDirective, InputGroup, InputGroupAddon, FormField]
})
export default class SignInForm implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly store = inject(SignInStore);
    protected readonly form$ = signal(this.store.signInData());
    protected readonly service = inject(SignInService);
    protected readonly formData = this.buildForm();
    private formInitialized: boolean = false;

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Ingreso',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private initializeData(): void {
        effect(() => {
            const data = this.store.signInData();

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
        return form<SignInData>(this.form$, (schema) => {
            applySignInValidation(schema)
        });
    }

    protected readonly CustomIcons = CustomIcons;
}
