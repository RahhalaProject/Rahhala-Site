import { Component } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { MegaMenu } from 'primeng/megamenu';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [AvatarModule, ButtonModule, MenubarModule,
    MegaMenu, ButtonModule, CommonModule
  ]
})
export class HeaderComponent {
  
   items: MegaMenuItem[] | undefined;
  constructor() {}

  ngOnInit() {
     this.items = [
            {
                label: 'الرئيسية',
                root: true,
            },
            {
                label: 'خدماتنا',
                root: true,
            },
            {
                label: 'من نحن',
                root: true,
            },
            {
                label: 'الدعم',
                root: true,
            },
            {
                label: '',
                root: false,
            },
        ];
    
    }
}
