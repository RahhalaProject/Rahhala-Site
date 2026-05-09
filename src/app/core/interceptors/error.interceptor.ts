import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

function problemDetailsSummary(body: unknown): string | null {
  if (body == null) return null;
  if (typeof body === 'string') {
    const t = body.trim();
    return t.length ? t : null;
  }
  if (typeof body === 'object') {
    const o = body as Record<string, unknown>;
    const title = o['title'];
    const detail = o['detail'];
    const message = o['message'];
    if (typeof title === 'string' && title.trim()) return title;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return null;
}

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

      const summary =
        problemDetailsSummary(error.error) ||
        (error.message ? error.message : null) ||
        `HTTP ${error.status}`;

      console.error('HTTP Error:', summary);

      // Preserve HttpErrorResponse so callers can read Problem Details (title, errorCodes, etc.).
      return throwError(() => error);
    })
  );
};
