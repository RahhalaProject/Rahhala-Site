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

  signUpForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      type: [1, Validators.required],
    });
  }

  ngOnInit() {}

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
      },
      error: (error) => {
        this.errorMessage.set(
          error.message || 'Login failed. Please try again.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
