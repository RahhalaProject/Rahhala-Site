import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { config } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeAr);
registerLocaleData(localeAr, 'ar-SA');

bootstrapApplication(App, config).catch((err) => console.error(err));
