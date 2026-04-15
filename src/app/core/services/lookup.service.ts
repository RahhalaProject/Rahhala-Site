import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { LookupCategory } from '../models/lookup-category.enum';
import { LookupResponse } from '../models/lookup-response.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly translate = inject(TranslateService);
  private readonly apiUrl = `${this.config.apiUrl}/v1/Lookup`;

  /**
   * POST to get-loockups-by-categories-ids.
   * Sends category IDs and receives lookup data keyed by category name.
   * Accept-Language (en | ar) is set from current translation language.
   */
  getLookupsByCategoryIds(
    categoryIds: LookupCategory[]
  ): Observable<LookupResponse> {
    const lang = this.translate.currentLang === 'ar' ? 'ar' : 'en';
    const headers = new HttpHeaders({
      'Accept-Language': lang,
    });

    return this.http
      .post<LookupResponse>(
        `${this.apiUrl}/get-loockups-by-categories-ids`,
        categoryIds,
        { headers }
      )
      .pipe(
        catchError((err) => {
          console.error('Lookup API error:', err);
          return throwError(() => err);
        })
      );
  }

  /**
   * Convenience: load lookups needed for order forms.
   * Returns ShipmentType, RequestType, CarType, WeightInTon, PalletCapacity, PrivateCar, RentDuration.
   */
  getOrderFormLookups(): Observable<LookupResponse> {
    const ids = [
      LookupCategory.ShipmentType,
      LookupCategory.RequestType,
      LookupCategory.CarType,
      LookupCategory.WeightInTon,
      LookupCategory.PalletCapacity,
      LookupCategory.PrivateCar,
      LookupCategory.RentDuration,
    ];
    return this.getLookupsByCategoryIds(ids);
  }
}
