import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        component: HomeLayoutComponent,
        children: [
            { path: 'home', loadComponent: () => import('./features/home/components/home/home.component').then(m => m.HomeComponent) },
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'auth', loadComponent: () => import('./core/components/auth/auth.component').then(m => m.AuthComponent) },
            { path: 'otp-verification', loadComponent: () => import('./core/components/otp-verification/otp-verification.component').then(m => m.OTPVerificationComponent) },
            { path: 'forgot-password', loadComponent: () => import('./core/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
            { path: 'reset-password', loadComponent: () => import('./core/components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
            { path: 'password-recovery-otp', loadComponent: () => import('./core/components/password-recovery-otp/password-recovery-otp.component').then(m => m.PasswordRecoveryOTPComponent) },
        ]
    },
    { path: '**', redirectTo: 'home' }
];
