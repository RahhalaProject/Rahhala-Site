import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const translate = inject(TranslateService);
  const lang = translate.currentLang || translate.defaultLang || 'ar';

  const cloned = req.clone({
    setHeaders: {
      'Content-Language': lang,
      'Accept-Language': lang,
    },
  });

  return next(cloned);
};
