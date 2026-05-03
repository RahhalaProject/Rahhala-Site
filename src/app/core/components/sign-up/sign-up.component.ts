import { Component, inject, signal } from '@angular/core';
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
        let friendlyMessage = 'Registration failed. Please try again.';
        if (error?.error && typeof error.error === 'object') {
          // Attempt to extract a user-friendly message from the error title
          // Prefer "title" property which is the backend's explanation string
          if (error.error.title) {
            friendlyMessage = error.error.title;
          }
        } else if (typeof error === 'string') {
          friendlyMessage = error;
        } else if (error?.message) {
          friendlyMessage = error.message;
        }
        this.errorMessage.set(friendlyMessage);
        this.isLoading.set(false);
      },
    });
  }
}
