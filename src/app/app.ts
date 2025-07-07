import { Component, OnInit } from '@angular/core';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [HomeLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected title = 'ClientApp';

  constructor(readonly primeng: PrimeNG) {}
  
  ngOnInit() {
        this.primeng.ripple.set(true);
  }
}
