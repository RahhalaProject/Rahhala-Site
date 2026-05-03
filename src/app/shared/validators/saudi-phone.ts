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
 * Saudi mobile numbers (common formats after digit normalization):
 * - 05xxxxxxxx (10 digits)
 * - 5xxxxxxxx (9 digits)
 * - 9665xxxxxxxx (12 digits, country code)
 */
export function isValidSaudiPhone(value: string | null | undefined): boolean {
  const d = saudiPhoneDigits(value);
  if (!d.length) {
    return false;
  }
  if (/^9665[0-9]{8}$/.test(d)) {
    return true;
  }
  if (/^05[0-9]{8}$/.test(d)) {
    return true;
  }
  if (/^5[0-9]{8}$/.test(d)) {
    return true;
  }
  return false;
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
