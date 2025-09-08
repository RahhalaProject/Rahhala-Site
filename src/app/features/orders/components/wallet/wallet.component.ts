import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'wallet',
  styleUrls: ['./wallet.component.scss'],
  templateUrl: './wallet.component.html',
  standalone: true,
  imports: [CardModule, ButtonModule, TranslateModule, CommonModule],
  providers: [MessageService],
})
export class WalletComponent {
  constructor(readonly translate: TranslateService) {}

  ngOnInit() {}
}
