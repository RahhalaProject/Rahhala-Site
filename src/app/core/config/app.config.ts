import { InjectionToken } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const appConfig: AppConfig = {
  production: false,
  apiUrl: 'https://rahalah.com.sa/api',
};
