import { Component, Input } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { MegaMenu } from 'primeng/megamenu';
import { RouterModule } from '@angular/router';
import { Select } from 'primeng/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [AvatarModule, ButtonModule, MenubarModule,
    MegaMenu, ButtonModule, CommonModule, RouterModule, Select,
    FormsModule, TranslateModule
  ],
  providers: [TranslateService]
})
export class HeaderComponent {

    @Input() isHomeLayout: boolean = true;
    items: MegaMenuItem[] | undefined;
    supportLanguages = ['en', 'ar'];
    selectedLanguage!: string;

    constructor(readonly config: PrimeNG, readonly translateService: TranslateService) {}

    ngOnInit() {
        this.items = [
            {
                label: 'الرئيسية',
                root: true,
                section: 'home'
            },
            {
                label: 'خدماتنا',
                root: true,
                section: 'service'
            },
            {
                label: 'من نحن',
                root: true,
                section: 'whoour'
            },
            {
                label: 'الدعم',
                root: true,
                section: 'support'
            },
            {
                label: '',
                root: false,
            },
        ];

        this.selectedLanguage = this.supportLanguages[0];
        
    }

    useLang(lang: any) {
        this.translateService.use(lang.value);
        this.translateService.get('primeng').subscribe((res) => {
            this.config.setTranslation(res);
        });
    }
}
