import { FormArray, ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function minSelectedCheckboxes(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!(control instanceof FormArray)) {
            return null;
        }
        const totalSelected = control.controls
            .map(c => c.value)
            .reduce((prev, next) => (next ? prev + 1 : prev), 0);

        return totalSelected >= min ? null : { minSelected: true };
    };
}