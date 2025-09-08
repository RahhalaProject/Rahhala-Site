import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputOtp,
    RouterModule,
    TranslateModule,
  ],
})
export class OTPVerificationComponent {
  constructor() {}
}
