import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { StepperModule } from 'primeng/stepper';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'order-track',
  styleUrls: ['./order-track.component.scss'],
  templateUrl: './order-track.component.html',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TranslateModule,
    StepperModule,
    CommonModule,
    AvatarModule,
  ],
  providers: [MessageService],
})
export class OrderTrackComponent {
  constructor() {}

  ngOnInit() {}
}
