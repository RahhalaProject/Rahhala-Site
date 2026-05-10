import { Component, inject, OnInit, signal } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { Message } from 'primeng/message';
import { Router, RouterModule } from '@angular/router';
import { emailOrSaudiPhoneValidator } from '../../../shared/validators/saudi-phone';
import { extractApiError } from '../../../shared/utils/api-error';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    TranslateModule,
    ReactiveFormsModule,
    ToastModule,
    Message,
    RouterModule,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotPasswordForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      phoneNumber: ['', emailOrSaudiPhoneValidator()],
    });
  }

  ngOnInit() {
    this.errorMessage.set('');
  }

  get phoneNumber() {
    return this.forgotPasswordForm.get('phoneNumber');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    let phoneNumber = this.forgotPasswordForm.value;
    this.authService.sendForgotPasswordOtp(phoneNumber).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/password-recovery-otp'], {
          state: {
            phoneNumber: this.phoneNumber?.value,
            fromForgotPassword: true,
          },
        });
      },
      error: (error) => {
        this.errorMessage.set(extractApiError(error, 'Password reset request failed. Please try again.'));
        this.isLoading.set(false);
      },
    });
  }
}
