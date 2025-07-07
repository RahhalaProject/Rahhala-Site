import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
  imports: [CardModule, ButtonModule],
})
export class FooterComponent {
  
  constructor() {}

  ngOnInit() {
  }
}
