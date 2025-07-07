import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'home-layout',
  styleUrls: ['./home-layout.component.scss'],
  templateUrl: './home-layout.component.html',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CardModule, ButtonModule]
})
export class HomeLayoutComponent {

  constructor() { }
}
