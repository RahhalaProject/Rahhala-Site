import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
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
