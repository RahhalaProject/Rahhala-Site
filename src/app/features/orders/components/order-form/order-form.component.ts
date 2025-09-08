import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StepperModule } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { MapComponent } from '../map/map.component';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'order-form',
  styleUrls: ['./order-form.component.scss'],
  templateUrl: './order-form.component.html',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TranslateModule,
    StepperModule,
    FormsModule,
    Select,
    Checkbox,
    InputGroupAddonModule,
    InputTextModule,
    CommonModule,
    Tag,
    InputTextModule,
    IftaLabelModule,
    TextareaModule,
    Dialog,
    FileUpload,
    ToastModule,
    DatePickerModule,
    MapComponent,
  ],
  providers: [MessageService],
})
export class OrderFormComponent {
  currentLang: string;
  visibleShipmentDetails: boolean = false;
  visibleUpload: boolean = false;
  visibleLocation: boolean = false;
  visibleDeliveryDate: boolean = false;
  visiblePaymentMethod: boolean = false;
  visibleLocationMap: boolean = false;
  cities: any;
  uploadedFiles: any[] = [];
  date: Date | undefined;
  visibleRequestPrivateTrip: boolean = false;
  constructor(
    readonly translate: TranslateService,
    readonly messageService: MessageService
  ) {
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang();
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngOnInit() {}

  showShipmentDetailsDialog() {
    this.visibleShipmentDetails = true;
  }

  showUploadDialog() {
    this.visibleUpload = true;
  }

  showLocationDialog() {
    this.visibleLocation = true;
  }

  showDeliveryDateDialog() {
    this.visibleDeliveryDate = true;
  }

  showPaymentMethodDialog() {
    this.visiblePaymentMethod = true;
  }

  showRequestPrivateTripDialog() {
    this.visibleRequestPrivateTrip = true;
  }

  showLocationMapDialog() {
    this.visibleLocationMap = true;
  }

  onInitialPricingClick() {
    // TODO: Implement initial pricing logic
    console.log('Initial pricing button clicked');
  }

  onOrderConfirmationClick() {
    // TODO: Implement order confirmation logic
    console.log('Order confirmation button clicked');
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }
}
