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
        ]
    },
    { path: '**', redirectTo: 'home' }
];
