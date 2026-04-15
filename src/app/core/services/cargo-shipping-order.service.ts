import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import {
  CargoShippingOrderResponse,
  CreateCargoShippingOrderRequest,
} from '../models/cargo-shipping-order.model';

@Injectable({
  providedIn: 'root',
})
export class CargoShippingOrderService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly apiUrl = `${this.config.apiUrl}/v1`;

  createOrder(
    request: CreateCargoShippingOrderRequest
  ): Observable<CargoShippingOrderResponse> {
    return this.http
      .post<CargoShippingOrderResponse>(`${this.apiUrl}/CargoShippingOrder`, request)
      .pipe(
        catchError((err) => {
          console.error('CargoShippingOrder create error:', err);
          return throwError(() => err);
        })
      );
  }

  uploadMultipleImages(files: File[]): Observable<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));

    return this.http
      .post<string[]>(`${this.apiUrl}/FileUpload/multiple-Image`, formData)
      .pipe(
        catchError((err) => {
          console.error('Multiple image upload error:', err);
          return throwError(() => err);
        })
      );
  }
}
