import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { LookupService } from '../../../../core/services/lookup.service';
import { LookupItem } from '../../../../core/models/lookup-item.model';
import { CargoShippingOrderService } from '../../../../core/services/cargo-shipping-order.service';
import { CreateCargoShippingOrderRequest } from '../../../../core/models/cargo-shipping-order.model';
import { PaymentMethod } from '../../../../core/models/payment-method.enum';
import { LocationService } from '../../../../core/services/location.service';

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
    InputTextModule,
    IftaLabelModule,
    TextareaModule,
    Dialog,
    FileUpload,
    DatePickerModule,
  ],
})
export class OrderFormComponent implements OnInit {
  private readonly lookupService = inject(LookupService);
  private readonly cargoShippingOrderService = inject(CargoShippingOrderService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  currentLang: string;
  visibleShipmentDetails = false;
  visibleUpload = false;
  visibleLocation = false;
  visibleDeliveryDate = false;
  visiblePaymentMethod = false;
  visibleLocationMap = false;
  uploadedFiles: File[] = [];
  uploadedImages: string[] = [];
  /** Earliest selectable delivery day (start of tomorrow); today and past dates are disabled. */
  minDeliveryDate!: Date;
  date: Date | undefined;
  visibleRequestPrivateTrip = false;

  // Lookup options (id + name)
  shipmentTypeOptions: LookupItem[] = [];
  requestTypeOptions: LookupItem[] = [];
  /** Labels from i18n; `value` is backend PaymentMethod enum (1–3). */
  paymentMethodOptions: { name: string; value: PaymentMethod }[] = [];
  carTypeOptions: LookupItem[] = [];
  weightInTonOptions: LookupItem[] = [];
  palletCapacityOptions: LookupItem[] = [];
  privateCarOptions: LookupItem[] = [];
  rentDurationOptions: LookupItem[] = [];
  cities: LookupItem[] = [];
  provinces: LookupItem[] = [];

  // Form selected values (ids from LookupItem when using optionValue="id")
  selectedShipmentType: string | null = null;
  selectedRequestType: string | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  selectedCarType: string | null = null;
  selectedWeightInTon: string | null = null;
  selectedPalletCapacity: string | null = null;
  selectedPrivateCar: string | null = null;
  selectedRentDuration: string | null = null;
  shipmentSpeed: 'Express' | 'Normal' = 'Express';
  shipmentLength: number | null = null;
  shipmentWidth: number | null = null;
  shipmentHeight: number | null = null;
  additionalNotes = '';

  pickupCityId: string | null = null;
  pickupProvinceId: string | null = null;
  pickupStreet = '';
  pickupPlaceName = '';
  pickupLatitude: number | null = null;
  pickupLongitude: number | null = null;

  recipientName = '';
  recipientPhone = '';
  deliveryCityId: string | null = null;
  deliveryProvinceId: string | null = null;
  deliveryStreet = '';
  deliveryPlaceName = '';
  deliveryLatitude: number | null = null;
  deliveryLongitude: number | null = null;
  private mapTarget: 'pickup' | 'delivery' = 'pickup';
  mapLat: number | null = null;
  mapLng: number | null = null;
  mapSearchText = '';
  selectedLocationDescription = '';
  orderConfirmationValidationMessage = '';
  showValidationErrors = false;
  showShipmentValidationErrors = false;
  showDeliveryDateValidationErrors = false;
  showPaymentMethodValidationErrors = false;
  showLocationValidationErrors = false;
  private readonly staticMapLocations = [
    {
      nameEn: 'Riyadh - Olaya',
      nameAr: 'الرياض - العليا',
      descriptionEn: 'Commercial district in central Riyadh',
      descriptionAr: 'حي تجاري في وسط الرياض',
      lat: 24.711667,
      lng: 46.674999,
    },
    {
      nameEn: 'Jeddah - Al Hamra',
      nameAr: 'جدة - الحمراء',
      descriptionEn: 'Popular coastal district in Jeddah',
      descriptionAr: 'حي ساحلي معروف في جدة',
      lat: 21.543333,
      lng: 39.172779,
    },
    {
      nameEn: 'Dammam - Al Faisaliyah',
      nameAr: 'الدمام - الفيصلية',
      descriptionEn: 'Residential area in Dammam',
      descriptionAr: 'منطقة سكنية في الدمام',
      lat: 26.420683,
      lng: 50.088795,
    },
  ];

  constructor(
    readonly translate: TranslateService,
    readonly messageService: MessageService
  ) {
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang();
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.buildPaymentMethodOptions();
      this.loadLookups();
      this.loadLocations();
    });
  }

  ngOnInit(): void {
    this.refreshMinDeliveryDate();
    this.date = new Date(this.minDeliveryDate);
    this.buildPaymentMethodOptions();
    this.loadLookups();
    this.loadLocations();
  }

  /** Tomorrow 00:00:00 local time — minimum allowed delivery date (excludes today). */
  private refreshMinDeliveryDate(): void {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(0, 0, 0, 0);
    this.minDeliveryDate = t;
  }

  private normalizeDeliveryDateIfNeeded(): void {
    if (!this.date) {
      return;
    }
    const minMs = this.startOfLocalDayMs(this.minDeliveryDate);
    const curMs = this.startOfLocalDayMs(this.date);
    if (curMs < minMs) {
      this.date = new Date(this.minDeliveryDate);
    }
  }

  private startOfLocalDayMs(d: Date): number {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
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

  private loadLookups(): void {
    this.lookupService.getOrderFormLookups().subscribe({
      next: (res) => {
        this.shipmentTypeOptions = res.ShipmentType ?? [];
        this.requestTypeOptions = res.RequestType ?? [];
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

  private loadLocations(): void {
    this.locationService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.translate.instant('loadCitiesError') || 'Failed to load cities',
        });
      },
    });

    this.locationService.getProvinces().subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            this.translate.instant('loadProvincesError') ||
            'Failed to load provinces',
        });
      },
    });
  }

  showShipmentDetailsDialog() {
    this.showShipmentValidationErrors = false;
    this.visibleShipmentDetails = true;
  }

  setShipmentSpeed(speed: 'Express' | 'Normal'): void {
    this.shipmentSpeed = speed;
  }

  /**
   * UI "Express" → API "Fast"; "Normal" → "Normal" (ShipmentSpeed enum names).
   */
  private getShipmentSpeedForApi(): string {
    return this.shipmentSpeed === 'Express' ? 'Fast' : 'Normal';
  }

  /** Maps selected payment to API string: "Cash" | "Visa" | "Walet". */
  private getPaymentMethodNameForApi(): string | null {
    if (this.selectedPaymentMethod == null) {
      return null;
    }
    const key = PaymentMethod[this.selectedPaymentMethod];
    return typeof key === 'string' ? key : null;
  }

  showUploadDialog() {
    this.visibleUpload = true;
  }

  showLocationDialog() {
    this.showLocationValidationErrors = false;
    this.visibleLocation = true;
  }

  showDeliveryDateDialog() {
    this.showDeliveryDateValidationErrors = false;
    this.refreshMinDeliveryDate();
    this.normalizeDeliveryDateIfNeeded();
    this.visibleDeliveryDate = true;
  }

  showPaymentMethodDialog() {
    this.showPaymentMethodValidationErrors = false;
    this.visiblePaymentMethod = true;
  }

  // Reserved for future trigger buttons in the main actions list.
  // showRequestPrivateTripDialog() {
  //   this.visibleRequestPrivateTrip = true;
  // }

  // Reserved for future trigger buttons in the main actions list.
  // showLocationMapDialog() {
  //   this.openLocationMap('pickup');
  // }

  openLocationMap(target: 'pickup' | 'delivery') {
    this.mapTarget = target;
    const targetLat =
      target === 'pickup' ? this.pickupLatitude : this.deliveryLatitude;
    const targetLng =
      target === 'pickup' ? this.pickupLongitude : this.deliveryLongitude;

    this.mapLat = targetLat ?? 24.7136;
    this.mapLng = targetLng ?? 46.6753;
    this.mapSearchText = '';
    this.selectedLocationDescription =
      target === 'pickup' ? this.pickupPlaceName : this.deliveryPlaceName;
    this.visibleLocationMap = true;
  }

  resetCurrentLocation() {
    // Static fallback coordinates until real map/location service is integrated.
    this.mapLat = 24.7136;
    this.mapLng = 46.6753;
    this.selectedLocationDescription =
      this.currentLang === 'ar'
        ? 'الموقع الحالي (وضع تجريبي)'
        : 'Current location (mock mode)';
    this.mapSearchText = '';
  }

  get filteredMapLocations() {
    const q = this.mapSearchText.trim().toLowerCase();
    if (!q) {
      return this.staticMapLocations;
    }

    return this.staticMapLocations.filter((location) => {
      const name = this.currentLang === 'ar' ? location.nameAr : location.nameEn;
      const desc =
        this.currentLang === 'ar'
          ? location.descriptionAr
          : location.descriptionEn;
      return `${name} ${desc}`.toLowerCase().includes(q);
    });
  }

  selectMapLocation(location: {
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    lat: number;
    lng: number;
  }) {
    this.mapLat = location.lat;
    this.mapLng = location.lng;
    this.selectedLocationDescription =
      this.currentLang === 'ar' ? location.descriptionAr : location.descriptionEn;
  }

  confirmLocation() {
    if (this.mapLat == null || this.mapLng == null) {
      this.resetCurrentLocation();
    }

    const lat = this.mapLat as number;
    const lng = this.mapLng as number;
    const placeName =
      this.selectedLocationDescription ||
      (this.currentLang === 'ar'
        ? `الموقع المحدد (${lat.toFixed(6)}, ${lng.toFixed(6)})`
        : `Selected location (${lat.toFixed(6)}, ${lng.toFixed(6)})`);

    if (this.mapTarget === 'pickup') {
      this.pickupLatitude = lat;
      this.pickupLongitude = lng;
      this.pickupPlaceName = placeName;
    } else {
      this.deliveryLatitude = lat;
      this.deliveryLongitude = lng;
      this.deliveryPlaceName = placeName;
    }

    this.visibleLocationMap = false;
  }

  onInitialPricingClick() {
    // TODO: Implement initial pricing logic
    console.log('Initial pricing button clicked');
  }

  onOrderConfirmationClick() {
    this.showValidationErrors = true;
    this.showShipmentValidationErrors = true;
    this.showDeliveryDateValidationErrors = true;
    this.showPaymentMethodValidationErrors = true;
    this.showLocationValidationErrors = true;
    const missingFields = this.getAllRequiredFieldErrors();
    if (missingFields.length) {
      this.orderConfirmationValidationMessage = this.buildValidationMessage(missingFields);
      this.showValidationToast(missingFields);
      return;
    }
    this.orderConfirmationValidationMessage = '';

    this.refreshMinDeliveryDate();
    this.normalizeDeliveryDateIfNeeded();

    const submitOrder = (images: string[]) => {
      const payload: CreateCargoShippingOrderRequest = {
        shipmentDetails: {
          description: this.additionalNotes?.trim() || 'Cargo shipment request',
          weight: 1,
          pieces: 1,
          shipmentTypeId: this.selectedShipmentType,
          shipmentSpeed: this.getShipmentSpeedForApi(),
          length: this.shipmentLength,
          width: this.shipmentWidth,
          height: this.shipmentHeight,
          additionalNotes: this.additionalNotes || null,
        },
        images,
        deliveryDate: this.date ? this.date.toISOString() : null,
        paymentMethod: this.getPaymentMethodNameForApi(),
        orderTypeId: this.selectedRequestType,
        pickupAddress: {
          cityId: this.pickupCityId,
          provinceId: this.pickupProvinceId,
          street: this.pickupStreet || null,
          placeName: this.pickupPlaceName || null,
          latitude: this.pickupLatitude,
          longitude: this.pickupLongitude,
        },
        deliveryAddress: {
          cityId: this.deliveryCityId,
          provinceId: this.deliveryProvinceId,
          street: this.deliveryStreet || null,
          placeName: this.deliveryPlaceName || null,
          latitude: this.deliveryLatitude,
          longitude: this.deliveryLongitude,
        },
        receiver: {
          name: this.recipientName || null,
          phone: this.recipientPhone || null,
        },
      };

      this.cargoShippingOrderService.createOrder(payload).subscribe({
        next: (res) => {
          this.router.navigate(['/our-services']).then(() => {
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
                (res.requestNo
                  ? `Request submitted. Request No: ${res.requestNo}`
                  : 'Request submitted successfully.'),
            });
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('error') || 'Error',
            detail:
              this.translate.instant('orderCreateError') || 'Failed to create order.',
          });
        },
      });
    };

    if (!this.uploadedFiles.length) {
      submitOrder([]);
      return;
    }

    this.cargoShippingOrderService.uploadMultipleImages(this.uploadedFiles).subscribe({
      next: (imagePaths) => {
        const images = imagePaths ?? [];
        this.uploadedImages = images;
        submitOrder(images);
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

  onFilesSelected(event: any): void {
    const files = ((event?.files ?? event?.currentFiles ?? []) as File[]).filter(
      Boolean
    );
    if (!files.length) {
      return;
    }
    this.uploadedFiles = files;
  }

  onUploadSaveClick(): void {
    this.visibleUpload = false;
    if (!this.uploadedFiles.length) {
      return;
    }
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('save') || 'Save',
      detail: `${this.uploadedFiles.length} file(s) ready for order confirmation.`,
    });
  }

  onUpload(event: any) {
    const files = ((event?.files ?? event?.currentFiles ?? []) as File[]).filter(
      Boolean
    );
    if (!files.length) {
      return;
    }
    this.uploadedFiles = files;
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('save') || 'Save',
      detail: `${this.uploadedFiles.length} file(s) ready for order confirmation.`,
    });
  }

  onShipmentDetailsSaveClick(): void {
    this.showShipmentValidationErrors = true;
    const missingFields = this.getShipmentDetailsRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visibleShipmentDetails = false;
  }

  onDeliveryDateSaveClick(): void {
    this.refreshMinDeliveryDate();
    this.normalizeDeliveryDateIfNeeded();
    this.showDeliveryDateValidationErrors = true;
    const missingFields = this.getDeliveryDateRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visibleDeliveryDate = false;
  }

  onPaymentMethodSaveClick(): void {
    this.showPaymentMethodValidationErrors = true;
    const missingFields = this.getPaymentMethodRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visiblePaymentMethod = false;
  }

  onLocationSaveClick(): void {
    this.showLocationValidationErrors = true;
    const missingFields = this.getLocationRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visibleLocation = false;
  }

  private getShipmentDetailsRequiredFieldErrors(): string[] {
    const missingFields: string[] = [];

    if (!this.selectedShipmentType) {
      missingFields.push(this.translate.instant('shipmentType'));
    }
    if (!this.selectedRequestType) {
      missingFields.push(this.translate.instant('orderType'));
    }
    if (this.shipmentLength == null) {
      missingFields.push(this.translate.instant('enterLength'));
    }
    if (this.shipmentWidth == null) {
      missingFields.push(this.translate.instant('enterWidth'));
    }
    if (this.shipmentHeight == null) {
      missingFields.push(this.translate.instant('enterHeight'));
    }
    return missingFields;
  }

  private getDeliveryDateRequiredFieldErrors(): string[] {
    const missingFields: string[] = [];
    if (!this.date) {
      missingFields.push(this.translate.instant('deliveryDate'));
    }
    return missingFields;
  }

  private getPaymentMethodRequiredFieldErrors(): string[] {
    const missingFields: string[] = [];
    if (this.selectedPaymentMethod == null) {
      missingFields.push(this.translate.instant('paymentMethod'));
    }
    return missingFields;
  }

  private getLocationRequiredFieldErrors(): string[] {
    const missingFields: string[] = [];
    if (!this.pickupCityId) {
      missingFields.push(`${this.translate.instant('pickupAddress')} - ${this.translate.instant('city')}`);
    }
    if (!this.pickupProvinceId) {
      missingFields.push(
        `${this.translate.instant('pickupAddress')} - ${this.translate.instant('districtName')}`
      );
    }
    if (!this.pickupStreet.trim()) {
      missingFields.push(
        `${this.translate.instant('pickupAddress')} - ${this.translate.instant('streetName')}`
      );
    }
    if (!this.recipientName.trim()) {
      missingFields.push(this.translate.instant('recipientName'));
    }
    if (!this.recipientPhone.trim()) {
      missingFields.push(this.translate.instant('phoneNumber'));
    }
    if (!this.deliveryCityId) {
      missingFields.push(`${this.translate.instant('address')} - ${this.translate.instant('city')}`);
    }
    if (!this.deliveryProvinceId) {
      missingFields.push(
        `${this.translate.instant('address')} - ${this.translate.instant('neighborhood')}`
      );
    }
    if (!this.deliveryStreet.trim()) {
      missingFields.push(
        `${this.translate.instant('address')} - ${this.translate.instant('streetName')}`
      );
    }
    return missingFields;
  }

  private getAllRequiredFieldErrors(): string[] {
    return [
      ...this.getShipmentDetailsRequiredFieldErrors(),
      ...this.getDeliveryDateRequiredFieldErrors(),
      ...this.getPaymentMethodRequiredFieldErrors(),
      ...this.getLocationRequiredFieldErrors(),
    ];
  }

  private showValidationToast(missingFields: string[]): void {
    const message = this.translate.instant('pleaseCompleteRequiredFields');
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('error') || 'Error',
      detail: message,
    });
  }

  private buildValidationMessage(missingFields: string[]): string {
    return this.translate.instant('pleaseCompleteRequiredFields');
  }

  get showShipmentErrors(): boolean {
    return this.showValidationErrors || this.showShipmentValidationErrors;
  }

  get showDeliveryDateErrors(): boolean {
    return this.showValidationErrors || this.showDeliveryDateValidationErrors;
  }

  get showPaymentMethodErrors(): boolean {
    return this.showValidationErrors || this.showPaymentMethodValidationErrors;
  }

  get showLocationErrors(): boolean {
    return this.showValidationErrors || this.showLocationValidationErrors;
  }

}
