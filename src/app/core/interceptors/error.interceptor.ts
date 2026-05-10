import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { extractApiError } from '../../shared/utils/api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        console.error('HTTP client error:', error.error.message);
        return throwError(() => error);
      }

      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      const summary = extractApiError(error, `HTTP ${error.status}`);

      console.error('HTTP Error:', summary);

      // Preserve HttpErrorResponse so callers can read Problem Details (title, errorCodes, etc.).
      return throwError(() => error);
    })
  );
};
