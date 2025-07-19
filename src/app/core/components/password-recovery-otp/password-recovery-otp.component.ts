import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'password-recovery-otp',
  templateUrl: './password-recovery-otp.component.html',
  styleUrl: './password-recovery-otp.component.scss',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, InputOtp, RouterModule]
})
export class PasswordRecoveryOTPComponent {
  
  constructor() {}

  ngOnInit() {}
  
}
