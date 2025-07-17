import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true,
  imports: [CardModule, ButtonModule, Fluid, FormsModule, InputTextModule]
})
export class SignInComponent {
  
  constructor() {}

  ngOnInit() {}
  
}
