import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const accessToken = tokenService.getAccessToken();

  // Skip token for auth endpoints
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh-token')
  ) {
    return next(req);
  }

  // Add token to request
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // If 401 and we have a refresh token, try to refresh
      if (error.status === 401 && tokenService.getRefreshToken()) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new token
            const newToken = tokenService.getAccessToken();
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
