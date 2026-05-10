import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import {
  MyProfileResponse,
  SingleImageUploadResponse,
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

  /**
   * POST multipart; response is `{ fileName }` — use as `profilePictureUrl` on profile PUT.
   */
  uploadSingleImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .post<SingleImageUploadResponse>(`${this.base}/FileUpload/single-Image`, formData)
      .pipe(map((res) => (res?.fileName ?? '').trim()));
  }
}
