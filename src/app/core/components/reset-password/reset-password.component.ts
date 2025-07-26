import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, PasswordModule, RouterModule, TranslateModule]
})
export class ResetPasswordComponent {
  
  constructor() {}

  ngOnInit() {}
  
}
