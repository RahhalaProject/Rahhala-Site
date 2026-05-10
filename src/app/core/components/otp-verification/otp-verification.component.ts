import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';
import { Message } from 'primeng/message';
import { extractApiError } from '../../../shared/utils/api-error';
import { OtpInputComponent } from '../../../shared/components/otp-input/otp-input.component';

@Component({
  selector: 'otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    OtpInputComponent,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    Message,
  ],
})
export class OTPVerificationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private location = inject(Location);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal('');
  phoneNumber = signal('');
  fromRegistration = false;
  private redirectUrl = '/';

  minutes = signal(5);
  seconds = signal(0);
  private timerInterval: any;
  private readonly TIMER_DURATION = 120; // 2 minutes in seconds

  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]],
    phoneNumber: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = (navigation?.extras.state ?? this.location.getState()) as {
      phoneNumber?: string;
      fromRegistration?: boolean;
      redirectUrl?: string;
    };

    this.fromRegistration = !!state?.fromRegistration;
    this.redirectUrl = state?.redirectUrl || '/';

    if (state?.phoneNumber) {
      this.phoneNumber.set(state.phoneNumber);
      // Set phone number into the form
      this.otpForm.get('phoneNumber')?.setValue(state.phoneNumber);
      // Start the timer
      this.startTimer();
      // Optionally clear state after use (for certain browsers/environments)
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
    } else {
      this.errorMessage.set(
        'Missing phone number. Please restart registration.'
      );
      this.router.navigate(['/auth']);
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
    // Remove sensitive/used data
    this.otpForm.get('phoneNumber')?.setValue('');
    this.phoneNumber.set('');
    this.fromRegistration = false;
    // Optionally clear state again on destroy
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

  private startTimer(): void {
    let totalSeconds = this.TIMER_DURATION;

    this.updateTimerDisplay(totalSeconds);

    this.timerInterval = setInterval(() => {
      totalSeconds--;
      this.updateTimerDisplay(totalSeconds);

      if (totalSeconds <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateTimerDisplay(totalSeconds: number): void {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    this.minutes.set(mins);
    this.seconds.set(secs);
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  get phoneNumberControl() {
    return this.otpForm.get('phoneNumber');
  }

  onSubmit(): void {
    if (this.otpForm.invalid || !this.phoneNumberControl?.value) {
      this.otp?.markAsTouched();
      this.phoneNumberControl?.markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const verification$ = this.fromRegistration
      ? this.authService.VerifyRegisterOtp({
          otpCode: this.otp?.value,
          phoneNumber: this.phoneNumberControl.value,
        })
      : this.authService.VerifyLoginOtp({
          otpCode: this.otp?.value,
          phoneNumber: this.phoneNumberControl.value,
        });

    verification$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate([this.redirectUrl]);
      },
      error: (error) => {
        this.errorMessage.set(extractApiError(error, 'OTP verification failed. Please try again.'));
        this.isLoading.set(false);
      },
    });
  }
}
