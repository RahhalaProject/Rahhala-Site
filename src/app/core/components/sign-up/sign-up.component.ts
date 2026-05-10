import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Checkbox } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { Message } from 'primeng/message';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { saudiPhoneValidator } from '../../../shared/validators/saudi-phone';
import { Router } from '@angular/router';
import { extractApiError } from '../../../shared/utils/api-error';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    Checkbox,
    TranslateModule,
    ReactiveFormsModule,
    ToastModule,
    Message,
  ],
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signUpForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        phoneNumber: ['', [Validators.required, saudiPhoneValidator()]],
        acceptTerms: [false, Validators.requiredTrue],
        type: [1, Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.errorMessage.set('');
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get phoneNumber() {
    return this.signUpForm.get('phoneNumber');
  }

  get acceptTerms() {
    return this.signUpForm.get('acceptTerms');
  }

  get type() {
    return this.signUpForm.get('type');
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.clearServerDuplicateErrors();

    this.authService.SendRegisterOtp(this.signUpForm.value).subscribe({
      next: (response) => {
        console.log(response);
        // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this.router.navigate([returnUrl]);
        this.router.navigate(['/otp-verification'], {
          // Pass data using the state property
          state: {
            phoneNumber: this.phoneNumber?.value,
            fromRegistration: true,
            // You might also pass: userId: apiResponse.userId
          },
        });
      },
      error: (error) => {
        this.applyRegisterApiError(error);
        this.isLoading.set(false);
      },
    });
  }

  private clearServerDuplicateErrors(): void {
    this.removeErrorKey(this.phoneNumber, 'duplicate');
    this.removeErrorKey(this.email, 'duplicate');
  }

  private removeErrorKey(
    control: ReturnType<FormGroup['get']>,
    key: string
  ): void {
    if (!control) return;
    const errs = control.errors;
    if (!errs?.[key]) return;
    const next = { ...errs };
    delete next[key];
    control.setErrors(Object.keys(next).length ? next : null);
  }

  /** Maps ProblemDetails-style body (title, errorCodes) to phone/email field errors when possible. */
  private applyRegisterApiError(error: unknown): void {
    const httpErr = error as HttpErrorResponse;
    const body = httpErr?.error;

    if (!body || typeof body !== 'object') {
      this.errorMessage.set(extractApiError(error, 'Registration failed. Please try again.'));
      return;
    }

    const codes: string[] = Array.isArray((body as { errorCodes?: unknown }).errorCodes)
      ? ((body as { errorCodes: string[] }).errorCodes ?? []).map(String)
      : [];
    const title =
      typeof (body as { title?: unknown }).title === 'string'
        ? (body as { title: string }).title
        : '';

    const phoneDup = this.isDuplicatePhoneConflict(codes, title);
    const emailDup = this.isDuplicateEmailConflict(codes, title);

    if (phoneDup) {
      this.phoneNumber?.setErrors({ duplicate: true });
      this.phoneNumber?.markAsTouched();
    }
    if (emailDup) {
      this.email?.setErrors({ duplicate: true });
      this.email?.markAsTouched();
    }

    if (phoneDup || emailDup) {
      this.errorMessage.set('');
      return;
    }

    this.errorMessage.set(extractApiError(error, 'Registration failed. Please try again.'));
  }

  private isDuplicatePhoneConflict(codes: string[], title: string): boolean {
    for (const c of codes) {
      if (/duplicate.*phone|phone.*duplicate|phonenimber|phonenumber.*duplicate/i.test(c)) {
        return true;
      }
    }
    const t = title.toLowerCase();
    return t.includes('phone') && t.includes('already');
  }

  private isDuplicateEmailConflict(codes: string[], title: string): boolean {
    for (const c of codes) {
      if (/duplicate.*mail|mail.*duplicate|email.*duplicate|duplicateemail/i.test(c)) {
        return true;
      }
    }
    const t = title.toLowerCase();
    return t.includes('email') && t.includes('already');
  }

}
