/**
 * Builds a usable image URL for p-avatar.
 * - Full http(s) / data URLs are returned as-is.
 * - Paths starting with `/` are resolved against the API host origin (e.g. `/images/users/...`).
 * - Bare file names (upload `fileName`) map to `{origin}/images/users/{fileName}`.
 */
export function resolveProfilePictureUrl(
  raw: string | null | undefined,
  apiBaseUrl: string
): string {
  const u = raw?.trim() ?? '';
  if (!u) return './images/profile.png';
  if (/^https?:\/\//i.test(u) || u.startsWith('data:')) return u;

  let origin: string;
  try {
    origin = new URL(apiBaseUrl).origin;
  } catch {
    return './images/profile.png';
  }

  if (u.startsWith('/')) return `${origin}${u}`;
  return `${origin}/images/users/${u}`;
}
