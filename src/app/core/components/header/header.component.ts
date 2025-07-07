import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [Toolbar, AvatarModule, ButtonModule, MenubarModule]
})
export class HeaderComponent {
  
   items: MenuItem[] | undefined;
  constructor() {}

  ngOnInit() { this.items = [
            {
                label: 'الرئيسية',
            },
            {
                label: 'خدماتنا',
            },
            {
                label: 'من نحن',
            },
            {
                label: 'الدعم',
            },
        ];
    }
}
