import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'auth-layout',
  styleUrls: ['./auth-layout.component.scss'],
  templateUrl: './auth-layout.component.html',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, ToastModule],
})
export class AuthLayoutComponent {

  constructor() { }
}
