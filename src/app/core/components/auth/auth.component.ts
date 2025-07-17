import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true,
  imports: [CommonModule, TabsModule, CardModule, SignInComponent, SignUpComponent]
})
export class AuthComponent {
  
  constructor() {}

  ngOnInit() {}
  
}
