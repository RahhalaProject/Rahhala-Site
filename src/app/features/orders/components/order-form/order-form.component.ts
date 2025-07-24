import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'order-form',
  styleUrls: ['./order-form.component.scss'],
  templateUrl: './order-form.component.html',
  standalone: true,
  imports: [CardModule, ButtonModule]
})
export class OrderFormComponent {

  constructor() { }
}
