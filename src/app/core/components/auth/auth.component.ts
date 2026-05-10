import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SignInComponent,
    SignUpComponent,
    TranslateModule,
  ],
})
export class AuthComponent {
  activeView = signal<'signin' | 'signup'>('signin');

  showSignUp(): void {
    this.activeView.set('signup');
  }

  showSignIn(): void {
    this.activeView.set('signin');
  }
}
