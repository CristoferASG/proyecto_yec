import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {Select} from 'primeng/select';
import {Button} from "primeng/button";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {CatalogueService} from "@utils/services";
import {CatalogueTypeEnum} from "@utils/enums";
import {CatalogueInterface} from "@utils/interfaces";
import {CareerStore} from "../../career.store";
import {careerFormValidation} from "./career-form.validation";
import {CareerState, InstitutionInterface} from "../../career.state";
import {InstitutionService} from "../../../institution/institution.service";
import {CustomMessageService} from "@utils/services";

const FORM_STATE_KEY = 'career';

/** Extensiones permitidas para el logo (lo que conoce el usuario). */
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
/** Tamaño máximo del archivo (2 MB). */
const MAX_LOGO_SIZE = 2_000_000;

@Component({
    selector: 'app-career-form',
    imports: [
        InputText,
        Select,
        Button,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './career-form.component.html',
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
export class CareerFormComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerStore);
    private readonly institutionService = inject(InstitutionService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly catalogueService = inject(CatalogueService);

    /** Referencia directa al signal del store: inputs escriben al store y el store alimenta el form en una sola fuente de verdad. */
    protected readonly form$: WritableSignal<CareerState> = this.careerCreateStore.formState;
    protected readonly formData: FieldTree<CareerState> = this.buildForm();

    /** Data-URL del logo para la vista previa. */
    protected readonly logoPreview = signal('');

    // Catálogos y opciones para los p-select. El form guarda el ID en formData.modalityId/typeId/institutionId.
    protected readonly modalities = signal<CatalogueInterface[]>([]);
    protected readonly types = signal<CatalogueInterface[]>([]);
    protected readonly institutions = signal<InstitutionInterface[]>([]);

    constructor() {
        // Al editar una carrera existente, si el logo cargado es un data-URL, mostrarlo como preview.
        effect(() => {
            const logo = this.form$().logo;
            this.logoPreview.set(logo?.startsWith('data:') ? logo : '');
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Carrera',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.loadCatalogues();
        this.loadInstitutions();
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

    private buildForm(): FieldTree<CareerState> {
        return form<CareerState>(this.form$, (schema) => {
            careerFormValidation(schema)
        });
    }

    /** Carga los catálogos de modalidad y tipo de carrera desde sessionStorage. */
    private loadCatalogues(): void {
        this.modalities.set(this.catalogueService.findByType(CatalogueTypeEnum.careers_modality));
        this.types.set(this.catalogueService.findByType(CatalogueTypeEnum.careers_type));
    }

    /** Carga las instituciones disponibles para el combo. */
    private loadInstitutions(): void {
        this.institutionService.findInstitutions(1, '').subscribe({
            next: (response) => {
                this.institutions.set(
                    (response.data as unknown[]).map((item: any) => ({
                        id: item.id,
                        code: item.code,
                        name: item.name
                    }))
                );
            }
        });
    }
}