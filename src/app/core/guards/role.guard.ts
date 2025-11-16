import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
