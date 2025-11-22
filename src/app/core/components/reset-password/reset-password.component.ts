import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Message } from 'primeng/message';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { ResetPasswordRequest } from '../../models/reset-password-request.model';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    Message,
  ],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);

  resetPasswordForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        phoneNumber: ['', Validators.required],
        otpCode: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.errorMessage.set('');
    const navigation = this.router.getCurrentNavigation();
    const state = (navigation?.extras.state ?? this.location.getState()) as {
      phoneNumber?: string;
      otp?: string;
    };

    if (state?.phoneNumber) {
      this.resetPasswordForm.get('phoneNumber')?.setValue(state.phoneNumber);
    } else {
      this.errorMessage.set(
        'Missing phone number. Please restart forgot-password.'
      );
      this.router.navigate(['/forgot-password']);
    }

    if (state?.otp) {
      this.resetPasswordForm.get('otpCode')?.setValue(state.otp);
    } else {
      this.errorMessage.set('Missing otp. Please restart forgot-password.');
      this.router.navigate(['/forgot-password']);
    }

    if (
      window &&
      window.history &&
      typeof window.history.replaceState === 'function'
    ) {
      // Overwrites the current history entry state, effectively 'clearing' the state for future navigations
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }

  ngOnDestroy(): void {
    if (
      window &&
      window.history &&
      typeof window.history.replaceState === 'function'
    ) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  get phoneNumber() {
    return this.resetPasswordForm.get('phoneNumber');
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    let body: ResetPasswordRequest = {
      phoneNumber: this.phoneNumber?.value,
      otpCode: this.resetPasswordForm.get('otpCode')?.value,
      password: this.password?.value,
      confirmedPassword: this.confirmPassword?.value,
    };
    this.authService.ResetPassword(body).subscribe({
      next: (response) => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        let friendlyMessage = 'Registration failed. Please try again.';
        if (error?.error && typeof error.error === 'object') {
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
