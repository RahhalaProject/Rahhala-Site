import { Injectable } from '@angular/core';
import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FcmTokenService {
  private firebaseApp: FirebaseApp | null = null;
  private cachedToken: string | null = null;

  async getBrowserToken(): Promise<string | null> {
    if (this.cachedToken) {
      return this.cachedToken;
    }

    if (!this.hasFirebaseConfig() || !environment.firebaseVapidKey) {
      return null;
    }

    if (!(await isSupported())) {
      return null;
    }

    if (typeof Notification === 'undefined') {
      return null;
    }

    const permission =
      Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();

    if (permission !== 'granted') {
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );

    const token = await getToken(getMessaging(this.getFirebaseApp()), {
      vapidKey: environment.firebaseVapidKey,
      serviceWorkerRegistration: registration,
    });

    this.cachedToken = token || null;
    return this.cachedToken;
  }

  private getFirebaseApp(): FirebaseApp {
    if (this.firebaseApp) {
      return this.firebaseApp;
    }

    if (!getApps().length) {
      this.firebaseApp = initializeApp(environment.firebase as FirebaseOptions);
      return this.firebaseApp;
    }

    this.firebaseApp = getApp();
    return this.firebaseApp;
  }

  private hasFirebaseConfig(): boolean {
    const firebaseConfig = environment.firebase as Partial<FirebaseOptions>;
    return !!(
      firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId
    );
  }
}
