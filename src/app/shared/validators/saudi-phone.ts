import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

/** Digits only — normalizes Saudi numbers for validation. */
export function saudiPhoneDigits(value: string | null | undefined): string {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Saudi mobile numbers — only the local format is accepted:
 * - 05xxxxxxxx (10 digits, must start with 05)
 */
export function isValidSaudiPhone(value: string | null | undefined): boolean {
  const d = saudiPhoneDigits(value);
  return /^05\d{8}$/.test(d);
}

/** Use together with `Validators.required` when the field must be present. */
export function saudiPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || String(v).trim() === '') {
      return null;
    }
    return isValidSaudiPhone(v) ? null : { saudiPhone: true };
  };
}

/** Forgot-password field: valid email OR valid Saudi phone. */
export function emailOrSaudiPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (raw == null || String(raw).trim() === '') {
      return { required: true };
    }
    const s = String(raw).trim();
    if (s.includes('@')) {
      return Validators.email(control);
    }
    return isValidSaudiPhone(s) ? null : { saudiPhone: true };
  };
}
