import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import {
  CarRentalOrderResponse,
  CreateCorporateCarRentalOrderRequest,
  CreatePersonalCarRentalOrderRequest,
} from '../models/car-rental-order.model';

@Injectable({
  providedIn: 'root',
})
export class CarRentalOrderService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly apiUrl = `${this.config.apiUrl}/v1`;

  createPersonal(
    request: CreatePersonalCarRentalOrderRequest
  ): Observable<CarRentalOrderResponse> {
    return this.http
      .post<CarRentalOrderResponse>(
        `${this.apiUrl}/CarRentalOrder/personal`,
        request
      )
      .pipe(
        catchError((err) => {
          console.error('CarRentalOrder personal create error:', err);
          return throwError(() => err);
        })
      );
  }

  createCorporate(
    request: CreateCorporateCarRentalOrderRequest
  ): Observable<CarRentalOrderResponse> {
    return this.http
      .post<CarRentalOrderResponse>(
        `${this.apiUrl}/CarRentalOrder/corporate`,
        request
      )
      .pipe(
        catchError((err) => {
          console.error('CarRentalOrder corporate create error:', err);
          return throwError(() => err);
        })
      );
  }
}
