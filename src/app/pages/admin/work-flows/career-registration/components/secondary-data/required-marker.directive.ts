// required-marker.directive.ts
import {
    Directive,
    ElementRef,
    OnInit,
    inject,
    input,
} from '@angular/core';
import {FormField, required} from '@angular/forms/signals';

@Directive({
    selector: 'label[requiredMarker]',
    standalone: true,
})
export class RequiredMarkerDirective implements OnInit {
    private el = inject(ElementRef<HTMLLabelElement>);

    // Recibe el FormField directamente
    requiredMarker = input<FormField<unknown> | null>(null);

    ngOnInit(): void {
        const field = this.requiredMarker();
        if (!field) return;

        const isRequired = this.detectRequired(field);
        this.updateDOM(isRequired);
    }

    private detectRequired(field: FormField<unknown>): boolean {
        // Signal Forms expone los validators en el estado interno
        // Inspeccionamos el validator compuesto del field
        const fieldState = (field as any)._fieldNode?.validators
            ?? (field as any).validators
            ?? [];

        // También intentar via el validatorFn del campo
        const validatorFn = (field as any)._validator
            ?? (field as any).validator;

        if (typeof validatorFn === 'function') {
            // Probar con un control vacío para ver si 'required' aparece
            const testResult = validatorFn({ value: null } as any);
            return testResult?.['required'] != null;
        }

        if (Array.isArray(fieldState)) {
            return fieldState.some(
                (v: any) => v === required || v?.name === 'required' || v?.name === 'requiredValidator'
            );
        }

        return false;
    }

    private updateDOM(show: boolean): void {
        const label: HTMLLabelElement = this.el.nativeElement;
        const existing = label.querySelector('.required-marker');

        if (show && !existing) {
            const span = document.createElement('span');
            span.className = 'required-marker';
            span.textContent = ' *';
            span.setAttribute('aria-hidden', 'true');
            label.appendChild(span);
        } else if (!show && existing) {
            existing.remove();
        }
    }
}
