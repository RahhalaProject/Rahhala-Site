import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import {
  MyProfileResponse,
  UpdateMyProfileRequest,
} from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly base = `${this.config.apiUrl}/v1`;

  getMyProfile(): Observable<MyProfileResponse> {
    return this.http.get<MyProfileResponse>(`${this.base}/Users/my-profile`);
  }

  updateMyProfile(body: UpdateMyProfileRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/Users/my-profile`, body);
  }

  /** POST multipart; response body is the image URL as plain text. */
  uploadSingleImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .post(`${this.base}/FileUpload/single-Image`, formData, {
        responseType: 'text',
      })
      .pipe(map((raw) => this.normalizeUploadUrl(raw)));
  }

  private normalizeUploadUrl(raw: string): string {
    const t = raw?.trim() ?? '';
    if (!t) return t;
    if (t.startsWith('"') && t.endsWith('"')) {
      try {
        return JSON.parse(t) as string;
      } catch {
        return t.slice(1, -1);
      }
    }
    return t;
  }
}
