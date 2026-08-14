import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {Button} from "primeng/button";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {InstitutionStore} from "../../institution.store";
import {institutionFormValidation} from "./institution-form.validation";
import {InstitutionState} from "../../institution.state";
import {CustomMessageService} from "@utils/services";

const FORM_STATE_KEY = 'institution';

/** Extensiones permitidas para el logo (lo que conoce el usuario). */
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
/** Tamaño máximo del archivo (2 MB). */
const MAX_LOGO_SIZE = 2_000_000;

@Component({
    selector: 'app-institution-form',
    imports: [
        InputText,
        Button,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './institution-form.component.html',
    styles: [`
        /* Cuadro de previsualización del logo — cuadrado, sin distorsionar la imagen. */
        .logo-preview {
            width: 96px;
            height: 96px;
            border: 1px solid var(--surface-border, #cbd5e1);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--surface-100, #f1f5f9);
            flex-shrink: 0;
        }
        .logo-preview.empty {
            color: var(--text-color-secondary, #94a3b8);
        }
        .logo-preview.empty i {
            font-size: 1.5rem;
        }
        .logo-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    `]
})
export class InstitutionFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly institutionCreateStore = inject(InstitutionStore);
    private readonly customMessageService = inject(CustomMessageService);

    /** Referencia directa al signal del store: inputs escriben al store y el store alimenta el form en una sola fuente de verdad. */
    protected readonly form$: WritableSignal<InstitutionState> = this.institutionCreateStore.formState;
    protected readonly formData: FieldTree<InstitutionState> = this.buildForm();

    /** Data-URL del logo para la vista previa. */
    protected readonly logoPreview = signal('');

    constructor() {
        // Al editar una institución existente, si el logo cargado es un data-URL, mostrarlo como preview.
        effect(() => {
            const logo = this.form$().logo;
            this.logoPreview.set(logo?.startsWith('data:') ? logo : '');
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Institución',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    protected onLogoSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (file.size > MAX_LOGO_SIZE) {
            this.customMessageService.showWarning({summary: 'Logo demasiado grande', detail: 'El logo supera el tamaño máximo de 2 MB.'});
            input.value = '';
            return;
        }

        const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            this.customMessageService.showWarning({summary: 'Formato no permitido', detail: 'Use PNG, JPG, JPEG o WEBP.'});
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            this.logoPreview.set(dataUrl);
            this.form$.update(s => ({...s, logo: dataUrl}));
        };
        reader.readAsDataURL(file);
    }

    protected removeLogo(): void {
        this.logoPreview.set('');
        this.form$.update(s => ({...s, logo: ''}));
    }

    /** Restringe la escritura a solo dígitos en tiempo real. */
    protected onNumericInput(event: Event, field: 'phone' | 'cellphone'): void {
        const input = event.target as HTMLInputElement;
        const limit = field === 'phone' ? 9 : 10;
        const cleaned = input.value.replace(/[^0-9]/g, '').slice(0, limit);
        if (input.value !== cleaned) {
            input.value = cleaned;
        }
        this.form$.update(s => ({...s, [field]: cleaned}));
    }

    private buildForm(): FieldTree<InstitutionState> {
        return form<InstitutionState>(this.form$, (schema) => {
            institutionFormValidation(schema)
        });
    }
}
