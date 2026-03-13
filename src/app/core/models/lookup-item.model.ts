/**
 * Represents a single lookup option from the API.
 * Uses `id` and `name` for dropdown binding (name is localized based on Accept-Language).
 */
export interface LookupItem {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
}
