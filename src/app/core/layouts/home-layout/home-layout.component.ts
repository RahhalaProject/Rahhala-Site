import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'home-layout',
  styleUrls: ['./home-layout.component.scss'],
  templateUrl: './home-layout.component.html',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, ToastModule],
})
export class HomeLayoutComponent {

  constructor() { }
}
