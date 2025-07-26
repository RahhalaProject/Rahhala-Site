import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
  imports: [CardModule, ButtonModule, TranslateModule],
})
export class FooterComponent {
  
  @Input() isHomeLayout: boolean = true;
  constructor() {}

  ngOnInit() {
  }
}
