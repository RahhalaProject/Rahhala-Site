import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'main-layout',
  styleUrls: ['./main-layout.component.scss'],
  templateUrl: './main-layout.component.html',
  standalone: true,
  //imports: [HeaderComponent, FooterComponent, CardModule, ButtonModule]
})
export class MainLayoutComponent {

  constructor() { }
}
