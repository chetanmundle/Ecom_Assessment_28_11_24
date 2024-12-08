import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceComparisonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const purchasePrice = control.get('purchasePrice')?.value;
    const sellingPrice = control.get('sellingPrice')?.value;

    if (purchasePrice && sellingPrice && sellingPrice <= purchasePrice) {
      return { priceMismatch: true }; // Custom error
    }
    return null;
  };
}
