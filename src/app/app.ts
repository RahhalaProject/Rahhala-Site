import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterModule, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [TranslateService]
})
export class App implements OnInit {

  protected title = 'ClientApp';
  supportLanguages = ['en', 'ar'];
  constructor(readonly primeng: PrimeNG, readonly translateService: TranslateService, @Inject(DOCUMENT) private document: Document) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang('en');
  }
  
  ngOnInit() {
        this.primeng.ripple.set(true);


      const lang = localStorage.getItem('lang') || 'en';
      this.translateService.use(lang);
      this.translateService.get('primeng').subscribe(res => {
        this.primeng.setTranslation(res);
      });

      const html = this.document.documentElement as HTMLElement;
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      html.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
  }
}
