import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { SliderItem } from '../models/slider.model';

@Injectable({
  providedIn: 'root',
})
export class SlidersService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly apiUrl = `${this.config.apiUrl}/v1/Sliders`;

  getSliders(): Observable<SliderItem[]> {
    return this.http.get<SliderItem[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Sliders list error:', err);
        return throwError(() => err);
      })
    );
  }

  getSliderDetails(id: string): Observable<SliderItem> {
    return this.http.get<SliderItem>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Slider details error:', err);
        return throwError(() => err);
      })
    );
  }
}
