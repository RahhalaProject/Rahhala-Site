import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { MyOrderResponse } from '../models/my-order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly apiUrl = `${this.config.apiUrl}/v1`;

  /**
   * GET /Order/my-orders
   * @param orderStatus optional filter (swagger `OrderStatus` 1–6).
   */
  getMyOrders(orderStatus?: number): Observable<MyOrderResponse[]> {
    let params = new HttpParams();
    if (orderStatus != null && !Number.isNaN(orderStatus)) {
      params = params.set('orderStatus', String(orderStatus));
    }

    return this.http
      .get<MyOrderResponse[]>(`${this.apiUrl}/Order/my-orders`, { params })
      .pipe(
        catchError((err) => {
          console.error('Order my-orders error:', err);
          return throwError(() => err);
        })
      );
  }
}
