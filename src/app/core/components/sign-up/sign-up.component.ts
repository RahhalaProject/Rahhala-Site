import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Checkbox } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule, InputTextModule, PasswordModule, Checkbox, TranslateModule]
})
export class SignUpComponent {
  
  constructor() {}

  ngOnInit() {}
}
