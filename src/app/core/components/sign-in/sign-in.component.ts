import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { saudiPhoneValidator } from '../../../shared/validators/saudi-phone';
import { Message } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { extractApiError } from '../../../shared/utils/api-error';
@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    Message,
    PasswordModule,
  ],
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Output() goToSignUp = new EventEmitter<void>();

  loginForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, saudiPhoneValidator()]],
      password: ['', Validators.required],
    });
    this.errorMessage.set('');
  }

  get phoneNumber() {
    return this.loginForm.get('phoneNumber');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.SendLoginOtp(this.loginForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/otp-verification'], {
          // Pass data using the state property
          state: {
            phoneNumber: this.phoneNumber?.value,
            fromRegistration: false,
            // You might also pass: userId: apiResponse.userId
          },
        });
      },
      error: (error) => {
        this.errorMessage.set(extractApiError(error, 'Login failed. Please try again.'));
        this.isLoading.set(false);
      },
    });
  }
}
