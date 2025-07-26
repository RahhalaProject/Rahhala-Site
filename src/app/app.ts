import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  constructor(readonly primeng: PrimeNG, readonly translateService: TranslateService) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang('en');
  }
  
  ngOnInit() {
        this.primeng.ripple.set(true);
  }
}
