import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { LookupItem } from '../models/lookup-item.model';
import { TranslateService } from '@ngx-translate/core';

interface LocationResult {
  id: string;
  name?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly translate = inject(TranslateService);
  private readonly apiUrl = `${this.config.apiUrl}/v1/Location`;

  getCities(): Observable<LookupItem[]> {
    return this.http.get<unknown>(`${this.apiUrl}/cities`).pipe(
      map((res) => this.toLookupItems(this.extractItems(res))),
      catchError((err) => {
        console.error('Cities API error:', err);
        return throwError(() => err);
      })
    );
  }

  getProvinces(): Observable<LookupItem[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/provinces`)
      .pipe(
        map((res) => this.toLookupItems(this.extractItems(res))),
        catchError((err) => {
          console.error('Provinces API error:', err);
          return throwError(() => err);
        })
      );
  }

  private extractItems(response: unknown): LocationResult[] {
    if (Array.isArray(response)) {
      return response as LocationResult[];
    }

    if (response && typeof response === 'object') {
      const maybeItems = (response as { items?: unknown; Items?: unknown }).items;
      if (Array.isArray(maybeItems)) {
        return maybeItems as LocationResult[];
      }

      const maybeItemsPascal = (response as { items?: unknown; Items?: unknown }).Items;
      if (Array.isArray(maybeItemsPascal)) {
        return maybeItemsPascal as LocationResult[];
      }
    }

    return [];
  }

  private toLookupItems(items: LocationResult[]): LookupItem[] {
    const isArabic = this.translate.currentLang === 'ar';

    return (items ?? []).map((item) => ({
      id: item.id,
      name: isArabic
        ? item.nameAr ?? item.name ?? item.nameEn ?? ''
        : item.nameEn ?? item.name ?? item.nameAr ?? '',
    }));
  }
}
