import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { RahhalaAuraPreset } from '../theme/rahala-preset';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_CONFIG, appConfig } from './core/config/app.config';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { langInterceptor } from './core/interceptors/lang.interceptor';
import { MessageService } from 'primeng/api';

export const config: ApplicationConfig = {
  providers: [
    MessageService,
    { provide: APP_CONFIG, useValue: appConfig },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([langInterceptor, authInterceptor, errorInterceptor])),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => {
            return new TranslateHttpLoader(http, './assets/i18n/', '.json');
          },
          deps: [HttpClient],
        },
      })
    ),
    providePrimeNG({
      theme: {
        preset: RahhalaAuraPreset,
        // Default is "system" → @media (prefers-color-scheme: dark). Force light-only UI.
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
