import { Component, inject, OnInit } from '@angular/core';
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
import { LookupService } from '../../../../core/services/lookup.service';
import { LookupItem } from '../../../../core/models/lookup-item.model';

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
export class OrderFormComponent implements OnInit {
  private readonly lookupService = inject(LookupService);

  currentLang: string;
  visibleShipmentDetails = false;
  visibleUpload = false;
  visibleLocation = false;
  visibleDeliveryDate = false;
  visiblePaymentMethod = false;
  visibleLocationMap = false;
  uploadedFiles: File[] = [];
  date: Date | undefined;
  visibleRequestPrivateTrip = false;

  // Lookup options (id + name)
  shipmentTypeOptions: LookupItem[] = [];
  requestTypeOptions: LookupItem[] = [];
  paymentMethodOptions: LookupItem[] = [];
  carTypeOptions: LookupItem[] = [];
  weightInTonOptions: LookupItem[] = [];
  palletCapacityOptions: LookupItem[] = [];
  privateCarOptions: LookupItem[] = [];
  rentDurationOptions: LookupItem[] = [];
  cities: LookupItem[] = []; // TODO: Replace with cities API when available

  // Form selected values (ids from LookupItem when using optionValue="id")
  selectedShipmentType: string | null = null;
  selectedRequestType: string | null = null;
  selectedPaymentMethod: string | null = null;
  selectedCarType: string | null = null;
  selectedWeightInTon: string | null = null;
  selectedPalletCapacity: string | null = null;
  selectedPrivateCar: string | null = null;
  selectedRentDuration: string | null = null;
  additionalNotes = '';

  constructor(
    readonly translate: TranslateService,
    readonly messageService: MessageService
  ) {
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang();
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.loadLookups();
    });
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  private loadLookups(): void {
    this.lookupService.getOrderFormLookups().subscribe({
      next: (res) => {
        this.shipmentTypeOptions = res.ShipmentType ?? [];
        this.requestTypeOptions = res.RequestType ?? [];
        this.paymentMethodOptions = res.PaymentMethod ?? [];
        this.carTypeOptions = res.CarType ?? [];
        this.weightInTonOptions = res.WeightInTon ?? [];
        this.palletCapacityOptions = res.PalletCapacity ?? [];
        this.privateCarOptions = res.PrivateCar ?? [];
        this.rentDurationOptions = res.RentDuration ?? [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.translate.instant('loadLookupsError') || 'Failed to load options',
        });
      },
    });
  }

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
