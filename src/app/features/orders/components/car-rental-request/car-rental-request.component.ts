import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LookupService } from '../../../../core/services/lookup.service';
import { LookupItem } from '../../../../core/models/lookup-item.model';
import { PaymentMethod } from '../../../../core/models/payment-method.enum';
import { CargoShippingOrderService } from '../../../../core/services/cargo-shipping-order.service';
import { CarRentalOrderService } from '../../../../core/services/car-rental-order.service';
import {
  CreateCorporateCarRentalOrderRequest,
  CreatePersonalCarRentalOrderRequest,
} from '../../../../core/models/car-rental-order.model';
import { DryBoxType } from '../../../../core/models/dry-box-type.enum';
import { LocationMapDialogComponent } from '../../../../shared/components/location-map-dialog/location-map-dialog.component';

@Component({
  selector: 'car-rental-request',
  styleUrls: ['./car-rental-request.component.scss'],
  templateUrl: './car-rental-request.component.html',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    Select,
    Checkbox,
    CommonModule,
    DatePickerModule,
    Dialog,
    InputTextModule,
    LocationMapDialogComponent,
  ],
})
export class CarRentalRequestComponent implements OnInit {
  private readonly lookupService = inject(LookupService);
  private readonly carRentalOrderService = inject(CarRentalOrderService);
  private readonly cargoShippingOrderService = inject(CargoShippingOrderService);
  private readonly router = inject(Router);

  currentLang: string;

  /** أقرب يوم لـ «من تاريخ» = غدًا (00:00 محلي). */
  minDate!: Date;

  carTypeOptions: LookupItem[] = [];
  shipmentTypeOptions: LookupItem[] = [];
  weightInTonOptions: LookupItem[] = [];
  palletCapacityOptions: LookupItem[] = [];
  rentDurationOptions: LookupItem[] = [];

  /** شخصي vs شركة */
  requestKind: 'personal' | 'corporate' = 'personal';
  companyName = '';

  selectedCarType: string | null = null;
  selectedShipmentType: string | null = null;
  /** Shown when selected shipment type has `key === "Dry"`. */
  selectedDryBoxType: DryBoxType | null = null;
  dryBoxTypeOptions: { name: string; value: DryBoxType }[] = [];

  selectedWeightInTon: string | null = null;
  selectedPalletCapacity: string | null = null;
  selectedRentDuration: string | null = null;

  fromDate: Date | undefined;
  toDate: Date | undefined;

  /** Mutually exclusive pickup choice: HQ vs user's location (default: HQ like mobile app). */
  pickupSource: 'hq' | 'my' = 'hq';

  /** When `pickupSource === 'my'`: text fields for API `deliveryAddress`. */
  pickupPlaceNameText = '';
  pickupStreetText = '';
  pickupLatitude: number | null = null;
  pickupLongitude: number | null = null;

  /** Map dialog (same flow as order-form pickup map). */
  visibleLocationMap = false;
  mapDialogLat: number | null = null;
  mapDialogLng: number | null = null;
  mapDialogDescription = '';

  paymentMethodOptions: { name: string; value: PaymentMethod }[] = [];
  /** Default Cash, consistent with API samples and mobile flow. */
  selectedPaymentMethod: PaymentMethod | null = PaymentMethod.Cash;
  visiblePaymentMethod = false;

  uploadedFiles: File[] = [];
  uploadedImages: string[] = [];
  visibleUpload = false;

  showValidationErrors = false;
  showPaymentMethodValidationErrors = false;

  constructor(
    readonly translate: TranslateService,
    readonly messageService: MessageService
  ) {
    this.refreshMinFromDate();
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang();
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.buildPaymentMethodOptions();
      this.buildDryBoxTypeOptions();
      this.loadLookups();
    });
  }

  ngOnInit(): void {
    this.refreshMinFromDate();
    this.buildPaymentMethodOptions();
    this.buildDryBoxTypeOptions();
    this.loadLookups();
  }

  /**
   * أقل يوم مسموح لـ «إلى تاريخ»: بعد «من تاريخ» بيوم واحد على الأقل.
   * إن لم يُختر «من» بعد، أقل «إلى» = بعد غدٍ (أي اليوم التالي لأقل «من»).
   */
  get minToDate(): Date {
    if (this.fromDate) {
      return this.addLocalDays(this.fromDate, 1);
    }
    return this.addLocalDays(this.minDate, 1);
  }

  /** Selected shipment type is Dry (جاف) — show dry box type selector. */
  get isDryShipmentSelected(): boolean {
    if (!this.selectedShipmentType) {
      return false;
    }
    const item = this.shipmentTypeOptions.find(
      (o) => o.id === this.selectedShipmentType
    );
    return item?.key === 'Dry';
  }

  onShipmentTypeIdChange(id: string | null): void {
    const item = id
      ? this.shipmentTypeOptions.find((o) => o.id === id)
      : undefined;
    if (item?.key !== 'Dry') {
      this.selectedDryBoxType = null;
    }
  }

  private buildDryBoxTypeOptions(): void {
    this.dryBoxTypeOptions = [
      {
        value: DryBoxType.Flatbed,
        name: this.translate.instant('dryBoxTypeFlatbed'),
      },
      {
        value: DryBoxType.Closed,
        name: this.translate.instant('dryBoxTypeClosed'),
      },
      {
        value: DryBoxType.Mesh,
        name: this.translate.instant('dryBoxTypeMesh'),
      },
    ];
  }

  private buildPaymentMethodOptions(): void {
    this.paymentMethodOptions = [
      {
        value: PaymentMethod.Cash,
        name: this.translate.instant('paymentMethodCash'),
      },
      {
        value: PaymentMethod.Visa,
        name: this.translate.instant('paymentMethodVisa'),
      },
      {
        value: PaymentMethod.Walet,
        name: this.translate.instant('paymentMethodWalet'),
      },
    ];
  }

  /** أقرب تاريخ بداية = غدًا (مثل طلب التوصيل: لا يُسمح باليوم الحالي). */
  private refreshMinFromDate(): void {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(0, 0, 0, 0);
    this.minDate = t;
  }

  private addLocalDays(d: Date, days: number): Date {
    const x = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() + days,
      0,
      0,
      0,
      0
    );
    return x;
  }

  onFromDateChange(): void {
    this.refreshMinFromDate();
    if (!this.fromDate) {
      return;
    }
    if (
      this.startOfLocalDayMs(this.fromDate) < this.startOfLocalDayMs(this.minDate)
    ) {
      this.fromDate = new Date(this.minDate);
    }
    if (
      !this.toDate ||
      this.startOfLocalDayMs(this.toDate) <=
        this.startOfLocalDayMs(this.fromDate)
    ) {
      this.toDate = this.addLocalDays(this.fromDate, 1);
    }
  }

  private normalizeDates(): void {
    this.refreshMinFromDate();
    const minFromMs = this.startOfLocalDayMs(this.minDate);
    if (this.fromDate && this.startOfLocalDayMs(this.fromDate) < minFromMs) {
      this.fromDate = new Date(this.minDate);
    }
    const minTo = this.minToDate;
    const minToMs = this.startOfLocalDayMs(minTo);
    if (this.toDate && this.startOfLocalDayMs(this.toDate) < minToMs) {
      this.toDate = new Date(minTo);
    }
    if (this.fromDate && this.toDate) {
      if (
        this.startOfLocalDayMs(this.toDate) <=
        this.startOfLocalDayMs(this.fromDate)
      ) {
        this.toDate = this.addLocalDays(this.fromDate, 1);
      }
    }
  }

  private startOfLocalDayMs(d: Date): number {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  /** للقالب والتحقق: «إلى» بعد «من» (ليست نفس اليوم). */
  isToAfterFrom(): boolean {
    if (!this.fromDate || !this.toDate) {
      return true;
    }
    return (
      this.startOfLocalDayMs(this.toDate) > this.startOfLocalDayMs(this.fromDate)
    );
  }

  /** Local calendar date at 00:00:00 UTC (matches sample ISO date-time payloads). */
  private toDateOnlyUtcIso(d: Date): string {
    return new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    ).toISOString();
  }

  private getPaymentMethodValueForApi(): PaymentMethod | null {
    return this.selectedPaymentMethod;
  }

  private loadLookups(): void {
    this.lookupService.getOrderFormLookups().subscribe({
      next: (res) => {
        this.carTypeOptions = res.CarType ?? [];
        this.shipmentTypeOptions = res.ShipmentType ?? [];
        this.weightInTonOptions = res.WeightInTon ?? [];
        this.palletCapacityOptions = res.PalletCapacity ?? [];
        this.rentDurationOptions = res.RentDuration ?? [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            this.translate.instant('loadLookupsError') || 'Failed to load options',
        });
      },
    });
  }

  onRequestKindPersonal(checked: boolean): void {
    if (checked) {
      this.requestKind = 'personal';
    } else if (this.requestKind === 'personal') {
      this.requestKind = 'corporate';
    }
  }

  onRequestKindCorporate(checked: boolean): void {
    if (checked) {
      this.requestKind = 'corporate';
    } else if (this.requestKind === 'corporate') {
      this.requestKind = 'personal';
    }
  }

  onPickupHqChange(checked: boolean): void {
    if (checked) {
      this.pickupSource = 'hq';
      this.clearMyPickupAddress();
    } else if (this.pickupSource === 'hq') {
      this.pickupSource = 'my';
    }
  }

  onPickupMyChange(checked: boolean): void {
    if (checked) {
      this.pickupSource = 'my';
    } else if (this.pickupSource === 'my') {
      this.pickupSource = 'hq';
      this.clearMyPickupAddress();
    }
  }

  private clearMyPickupAddress(): void {
    this.pickupPlaceNameText = '';
    this.pickupStreetText = '';
    this.pickupLatitude = null;
    this.pickupLongitude = null;
    this.mapDialogLat = null;
    this.mapDialogLng = null;
    this.mapDialogDescription = '';
  }

  /** زر الخريطة: وصف مختار أو نص افتراضي. */
  get pickupMapButtonText(): string {
    const d = this.mapDialogDescription?.trim();
    if (d) {
      return d;
    }
    return this.translate.instant('setLocationOnMap');
  }

  openPickupLocationMap(): void {
    this.mapDialogLat = this.pickupLatitude ?? 24.7136;
    this.mapDialogLng = this.pickupLongitude ?? 46.6753;
    this.mapDialogDescription = this.mapDialogDescription?.trim() ?? '';
    this.visibleLocationMap = true;
  }

  onMapLocationConfirmed(event: {
    lat: number;
    lng: number;
    description: string;
  }): void {
    const { lat, lng, description } = event;
    this.pickupLatitude = lat;
    this.pickupLongitude = lng;
    this.mapDialogDescription = description;
  }

  showPaymentMethodDialog(): void {
    this.showPaymentMethodValidationErrors = false;
    this.visiblePaymentMethod = true;
  }

  onPaymentMethodSaveClick(): void {
    this.showPaymentMethodValidationErrors = true;
    if (this.selectedPaymentMethod == null) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('error') || 'Error',
        detail:
          this.translate.instant('pleaseCompleteRequiredFields') ||
          'Please complete required fields.',
      });
      return;
    }
    this.visiblePaymentMethod = false;
  }

  showUploadDialog(): void {
    this.visibleUpload = true;
  }

  onFilesSelected(event: { files?: File[]; currentFiles?: File[] }): void {
    const files = (
      (event?.files ?? event?.currentFiles ?? []) as File[]
    ).filter(Boolean);
    if (!files.length) {
      return;
    }
    this.uploadedFiles = files;
  }

  onUpload(event: { files?: File[]; currentFiles?: File[] }): void {
    this.onFilesSelected(event);
    if (this.uploadedFiles.length) {
      this.messageService.add({
        severity: 'info',
        summary: this.translate.instant('save') || 'Save',
        detail: `${this.uploadedFiles.length} file(s) ready.`,
      });
    }
  }

  onUploadSaveClick(): void {
    this.visibleUpload = false;
  }

  onCancel(): void {
    void this.router.navigate(['/our-services']);
  }

  onInitialPricingClick(): void {
    // Reserved for future pricing API; validate form shape only.
    this.refreshMinFromDate();
    this.normalizeDates();
    this.showValidationErrors = true;
    this.showPaymentMethodValidationErrors = true;
    const missing = this.getMissingFields();
    if (missing.length) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant('initialPricing') || 'Initial pricing',
        detail:
          this.translate.instant('pleaseCompleteRequiredFields') ||
          'Please complete required fields.',
      });
      return;
    }
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('initialPricing') || 'Initial pricing',
      detail:
        this.translate.instant('initialPricingPendingMessage') ||
        'Pricing will be available soon.',
    });
  }

  onConfirmOrder(): void {
    this.refreshMinFromDate();
    this.normalizeDates();
    this.showValidationErrors = true;
    this.showPaymentMethodValidationErrors = true;
    const missing = this.getMissingFields();
    if (missing.length) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('error') || 'Error',
        detail:
          this.translate.instant('pleaseCompleteRequiredFields') ||
          'Please complete required fields.',
      });
      return;
    }

    const baseFields: Omit<
      CreatePersonalCarRentalOrderRequest,
      'images' | 'dryBoxTypeId' | 'deliveryAddress'
    > = {
      carTypeId: this.selectedCarType!,
      shipmentTypeId: this.selectedShipmentType!,
      weightInTonId: this.selectedWeightInTon!,
      palletCapacityId: this.selectedPalletCapacity!,
      rentDurationId: this.selectedRentDuration!,
      fromDate: this.toDateOnlyUtcIso(this.fromDate!),
      toDate: this.toDateOnlyUtcIso(this.toDate!),
      isFromHeadquarters: this.pickupSource === 'hq',
      paymentMethod: this.getPaymentMethodValueForApi(),
    };

    const submit = (images: string[]) => {
      const personal: CreatePersonalCarRentalOrderRequest = {
        ...baseFields,
        images,
        ...(this.isDryShipmentSelected &&
        this.selectedDryBoxType != null
          ? { dryBoxTypeId: this.selectedDryBoxType }
          : {}),
        ...(this.pickupSource === 'my'
          ? {
              deliveryAddress: {
                placeName: this.pickupPlaceNameText.trim() || null,
                street: this.pickupStreetText.trim() || null,
                latitude: this.pickupLatitude,
                longitude: this.pickupLongitude,
              },
            }
          : {}),
      };
      if (this.requestKind === 'corporate') {
        const corp: CreateCorporateCarRentalOrderRequest = {
          ...personal,
          companyName: this.companyName.trim(),
        };
        this.carRentalOrderService.createCorporate(corp).subscribe({
          next: (res) => this.onOrderSuccess(res),
          error: () => this.onOrderError(),
        });
      } else {
        this.carRentalOrderService.createPersonal(personal).subscribe({
          next: (res) => this.onOrderSuccess(res),
          error: () => this.onOrderError(),
        });
      }
    };

    if (!this.uploadedFiles.length) {
      submit([]);
      return;
    }

    this.cargoShippingOrderService.uploadMultipleImages(this.uploadedFiles).subscribe({
      next: (imagePaths) => {
        submit(imagePaths ?? []);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('error') || 'Error',
          detail:
            this.translate.instant('uploadImageError') ||
            'Failed to upload image(s).',
        });
      },
    });
  }

  private onOrderSuccess(res: { requestNo?: string | null }): void {
    void this.router.navigate(['/my-orders']).then(() => {
      const detail = res.requestNo
        ? this.translate.instant('orderAddedSuccessDetail', {
            requestNo: res.requestNo,
          })
        : this.translate.instant('orderAddedSuccessDetailPlain');
      this.messageService.add({
        severity: 'success',
        summary:
          this.translate.instant('orderAddedSuccessSummary') || 'Success',
        detail:
          detail ||
          this.translate.instant('orderAddedSuccessDetailPlain') ||
          'Request submitted.',
      });
    });
  }

  private onOrderError(): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('error') || 'Error',
      detail:
        this.translate.instant('carRentalOrderCreateError') ||
        'Failed to submit car rental request.',
    });
  }

  private getMissingFields(): string[] {
    const m: string[] = [];
    if (this.requestKind === 'corporate' && !this.companyName.trim()) {
      m.push(this.translate.instant('companyNameLabel'));
    }
    if (!this.selectedCarType) {
      m.push(this.translate.instant('carType'));
    }
    if (!this.selectedShipmentType) {
      m.push(this.translate.instant('shipmentType'));
    }
    if (
      this.isDryShipmentSelected &&
      this.selectedDryBoxType == null
    ) {
      m.push(this.translate.instant('dryBoxType'));
    }
    if (!this.selectedWeightInTon) {
      m.push(this.translate.instant('weightTons'));
    }
    if (!this.selectedPalletCapacity) {
      m.push(this.translate.instant('loadByPallet'));
    }
    if (!this.selectedRentDuration) {
      m.push(this.translate.instant('rentDuration'));
    }
    if (!this.fromDate) {
      m.push(this.translate.instant('fromDate'));
    }
    if (!this.toDate) {
      m.push(this.translate.instant('toDate'));
    }
    if (
      this.fromDate &&
      this.toDate &&
      !this.isToAfterFrom()
    ) {
      m.push(this.translate.instant('toDateMustBeAfterFromDate'));
    }
    if (this.pickupSource === 'my') {
      if (!this.pickupPlaceNameText.trim()) {
        m.push(this.translate.instant('placeName'));
      }
      if (!this.pickupStreetText.trim()) {
        m.push(this.translate.instant('streetName'));
      }
    }
    if (this.selectedPaymentMethod == null) {
      m.push(this.translate.instant('paymentMethod'));
    }
    return m;
  }
}
