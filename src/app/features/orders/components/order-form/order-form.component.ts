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
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { LookupService } from '../../../../core/services/lookup.service';
import { LookupItem } from '../../../../core/models/lookup-item.model';
import { CargoShippingOrderService } from '../../../../core/services/cargo-shipping-order.service';
import { CreateCargoShippingOrderRequest } from '../../../../core/models/cargo-shipping-order.model';
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
    ToastModule,
    DatePickerModule,
  ],
  providers: [MessageService],
})
export class OrderFormComponent implements OnInit {
  private readonly lookupService = inject(LookupService);
  private readonly cargoShippingOrderService = inject(CargoShippingOrderService);
  private readonly locationService = inject(LocationService);

  currentLang: string;
  visibleShipmentDetails = false;
  visibleUpload = false;
  visibleLocation = false;
  visibleDeliveryDate = false;
  visiblePaymentMethod = false;
  visibleLocationMap = false;
  uploadedFiles: File[] = [];
  uploadedImages: string[] = [];
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
  cities: LookupItem[] = [];
  provinces: LookupItem[] = [];

  // Form selected values (ids from LookupItem when using optionValue="id")
  selectedShipmentType: string | null = null;
  selectedRequestType: string | null = null;
  selectedPaymentMethod: string | null = null;
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
  showValidationErrors = false;
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
      this.loadLookups();
      this.loadLocations();
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadLocations();
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
    this.visibleShipmentDetails = true;
  }

  setShipmentSpeed(speed: 'Express' | 'Normal'): void {
    this.shipmentSpeed = speed;
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
    const missingFields = this.getAllRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }

    const payload: CreateCargoShippingOrderRequest = {
      shipmentDetails: {
        description: null,
        weight: 0,
        pieces: 0,
        shipmentTypeId: this.selectedShipmentType,
        shipmentSpeed: this.shipmentSpeed,
        length: this.shipmentLength,
        width: this.shipmentWidth,
        height: this.shipmentHeight,
        additionalNotes: this.additionalNotes || null,
      },
      images: this.uploadedImages,
      deliveryDate: this.date ? this.date.toISOString() : null,
      paymentMethod: this.selectedPaymentMethod,
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
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('success') || 'Success',
          detail: res.requestNo
            ? `Order created successfully. Request No: ${res.requestNo}`
            : 'Order created successfully.',
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
  }

  onShipmentDetailsSaveClick(): void {
    this.showValidationErrors = true;
    const missingFields = this.getShipmentDetailsRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visibleShipmentDetails = false;
  }

  onDeliveryDateSaveClick(): void {
    this.showValidationErrors = true;
    const missingFields = this.getDeliveryDateRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visibleDeliveryDate = false;
  }

  onPaymentMethodSaveClick(): void {
    this.showValidationErrors = true;
    const missingFields = this.getPaymentMethodRequiredFieldErrors();
    if (missingFields.length) {
      this.showValidationToast(missingFields);
      return;
    }
    this.visiblePaymentMethod = false;
  }

  onLocationSaveClick(): void {
    this.showValidationErrors = true;
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
    if (!this.selectedPaymentMethod) {
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
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('error') || 'Error',
      detail: `${this.translate.instant('pleaseCompleteRequiredFields')}\n${missingFields.join(', ')}`,
    });
  }

  onUpload(event: any) {
    const files = ((event?.files ?? []) as File[]).filter(Boolean);
    if (!files.length) {
      return;
    }

    this.uploadedFiles = files;
    this.cargoShippingOrderService.uploadMultipleImages(files).subscribe({
      next: (imagePaths) => {
        this.uploadedImages = imagePaths ?? [];
        this.messageService.add({
          severity: 'success',
          summary: 'File Uploaded',
          detail: `${this.uploadedImages.length} image(s) uploaded successfully.`,
        });
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
}
