import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'our-services',
  styleUrls: ['./our-services.component.scss'],
  templateUrl: './our-services.component.html',
  standalone: true,
  imports: [CardModule, ButtonModule]
})
export class OurServicesComponent {

  constructor() { }
}
