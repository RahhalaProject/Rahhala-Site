import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CardModule, ButtonModule]
})
export class HomeComponent {

  constructor() { }
}
