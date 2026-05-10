import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extracts a user-facing message from an API error response.
 * Reads ProblemDetails fields in priority order: title → detail → message.
 * Falls back to the provided fallback string if nothing is found.
 */
export function extractApiError(error: unknown, fallback = 'An error occurred. Please try again.'): string {
  if (typeof error === 'string' && error.trim()) return error;

  const httpErr = error as HttpErrorResponse | undefined;
  const body = httpErr?.error;

  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    if (typeof o['title'] === 'string' && o['title'].trim()) return o['title'];
    if (typeof o['detail'] === 'string' && o['detail'].trim()) return o['detail'];
    if (typeof o['message'] === 'string' && o['message'].trim()) return o['message'];
  }

  const msg = (error as { message?: string })?.message;
  if (msg && typeof msg === 'string' && msg.trim()) return msg;

  return fallback;
}
