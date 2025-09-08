import { Component, Input } from '@angular/core';
import { MegaMenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { MegaMenu } from 'primeng/megamenu';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { PopoverModule } from 'primeng/popover';
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    MenubarModule,
    MegaMenu,
    ButtonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    PopoverModule,
  ],
  providers: [TranslateService],
})
export class HeaderComponent {
  @Input() isHomeLayout: boolean = true;
  items: MegaMenuItem[] | undefined;
  supportLanguages = ['en', 'ar'];
  selectedLanguage!: string;
  items2: any;
  constructor(
    readonly config: PrimeNG,
    readonly translateService: TranslateService,
    @Inject(DOCUMENT) readonly document: Document
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'home',
        root: true,
        section: 'home',
      },
      {
        label: 'ourServices',
        root: true,
        section: 'service',
      },
      {
        label: 'aboutUs',
        root: true,
        section: 'whoour',
      },
      {
        label: 'support',
        root: true,
        section: 'support',
      },
      {
        label: '',
        root: false,
      },
    ];

    this.selectedLanguage = this.supportLanguages[0];
  }

  useLang(lang: any) {
    // this.translateService.use(lang.value);
    // this.translateService.get('primeng').subscribe((res) => {
    //     this.config.setTranslation(res);
    // });

    const selectedLang = lang.value || lang; // handle both { value: 'ar' } or 'ar'

    this.translateService.use(selectedLang);
    localStorage.setItem('lang', selectedLang);

    this.translateService.get('primeng').subscribe((res) => {
      this.config.setTranslation(res);
    });

    // Change direction dynamically
    const html = this.document.documentElement as HTMLElement;
    html.setAttribute('dir', selectedLang === 'ar' ? 'rtl' : 'ltr');

    // Optionally: Change a custom class (for styling)
    html.classList.remove('rtl', 'ltr');
    html.classList.add(selectedLang === 'ar' ? 'rtl' : 'ltr');

    // Optional hard reload (only if needed):
    // location.reload(); // not ideal; use only if component doesn't detect dir change
  }

  changeLang() {
    const currentLang =
      this.translateService.currentLang || localStorage.getItem('lang') || 'en';

    // عكس اللغة (اختياري لو عايز toggle)
    const selectedLang = currentLang === 'ar' ? 'en' : 'ar';

    this.translateService.use(selectedLang);
    localStorage.setItem('lang', selectedLang);

    this.translateService.get('primeng').subscribe((res) => {
      this.config.setTranslation(res);
    });

    // Change direction dynamically
    const html = this.document.documentElement as HTMLElement;
    html.setAttribute('dir', selectedLang === 'ar' ? 'rtl' : 'ltr');

    // Optionally: Change a custom class (for styling)
    html.classList.remove('rtl', 'ltr');
    html.classList.add(selectedLang === 'ar' ? 'rtl' : 'ltr');

    // Optional hard reload (only if needed):
    // location.reload(); // not ideal; use only if component doesn't detect dir change
  }
}
