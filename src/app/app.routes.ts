import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

// canActivate: [authGuard, roleGuard],
//     data: { roles: ['Admin'] }

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/components/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadComponent: () =>
          import('./core/components/auth/auth.component').then(
            (m) => m.AuthComponent
          ),
      },
      {
        path: 'otp-verification',
        loadComponent: () =>
          import(
            './core/components/otp-verification/otp-verification.component'
          ).then((m) => m.OTPVerificationComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './core/components/forgot-password/forgot-password.component'
          ).then((m) => m.ForgotPasswordComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import(
            './core/components/reset-password/reset-password.component'
          ).then((m) => m.ResetPasswordComponent),
      },
      {
        path: 'password-recovery-otp',
        loadComponent: () =>
          import(
            './core/components/password-recovery-otp/password-recovery-otp.component'
          ).then((m) => m.PasswordRecoveryOTPComponent),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'our-services',
        loadComponent: () =>
          import(
            './features/orders/components/our-services/our-services.component'
          ).then((m) => m.OurServicesComponent),
      },
      {
        path: 'request-form',
        loadComponent: () =>
          import(
            './features/orders/components/order-form/order-form.component'
          ).then((m) => m.OrderFormComponent),
      },
      {
        path: 'car-rental-request',
        loadComponent: () =>
          import(
            './features/orders/components/car-rental-request/car-rental-request.component'
          ).then((m) => m.CarRentalRequestComponent),
      },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./features/orders/components/wallet/wallet.component').then(
            (m) => m.WalletComponent
          ),
      },
      {
        path: 'tracking',
        loadComponent: () =>
          import(
            './features/orders/components/order-track/order-track.component'
          ).then((m) => m.OrderTrackComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
