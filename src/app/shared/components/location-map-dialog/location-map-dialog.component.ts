import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { GoogleMapsLoaderService } from '../../../core/services/google-maps-loader.service';
import { environment } from '../../../../environments/environment';

type ConfirmPayload = {
  lat: number;
  lng: number;
  description: string;
};

@Component({
  selector: 'location-map-dialog',
  standalone: true,
  templateUrl: './location-map-dialog.component.html',
  styleUrls: ['./location-map-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    Dialog,
    ButtonModule,
    InputTextModule,
  ],
})
export class LocationMapDialogComponent implements OnChanges {
  private readonly googleMapsLoaderService = inject(GoogleMapsLoaderService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() header = '';
  @Input() initialLat: number | null = null;
  @Input() initialLng: number | null = null;
  @Input() initialDescription = '';

  @Output() locationConfirmed = new EventEmitter<ConfirmPayload>();

  @ViewChild('mapCanvas') private mapCanvas?: ElementRef<HTMLDivElement>;

  mapLat: number | null = null;
  mapLng: number | null = null;
  mapSearchText = '';
  selectedLocationDescription = '';

  private googleMap: any | null = null;
  private googleMarker: any | null = null;
  private googleGeocoder: any | null = null;

  constructor(readonly translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.mapLat = this.initialLat ?? 24.7136;
      this.mapLng = this.initialLng ?? 46.6753;
      this.selectedLocationDescription = this.initialDescription?.trim() ?? '';
      this.mapSearchText = '';

      setTimeout(() => {
        void this.initializeGoogleMap();
      }, 0);
    }
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  searchMapLocation(): void {
    const query = this.mapSearchText.trim();
    if (!query || !this.googleGeocoder) {
      return;
    }
    this.googleGeocoder.geocode({ address: query }, (results: any, status: string) => {
      if (status !== 'OK' || !results?.length) {
        return;
      }
      const point = results[0].geometry?.location;
      if (!point) {
        return;
      }
      this.updateLocationFromMap(
        point.lat(),
        point.lng(),
        results[0].formatted_address
      );
    });
  }

  resetCurrentLocation(): void {
    this.mapLat = 24.7136;
    this.mapLng = 46.6753;
    this.selectedLocationDescription = '';
    this.mapSearchText = '';
    this.syncMarkerWithCurrentCoordinates();
    this.reverseGeocode(this.mapLat, this.mapLng);
  }

  confirmLocation(): void {
    if (this.mapLat == null || this.mapLng == null) {
      this.resetCurrentLocation();
    }

    const lat = this.mapLat as number;
    const lng = this.mapLng as number;
    const description =
      this.selectedLocationDescription ||
      (this.translate.currentLang === 'ar'
        ? `الموقع المحدد (${lat.toFixed(6)}, ${lng.toFixed(6)})`
        : `Selected location (${lat.toFixed(6)}, ${lng.toFixed(6)})`);

    this.locationConfirmed.emit({ lat, lng, description });
    this.closeDialog();
  }

  get mapCoordinatesDisplay(): string {
    if (this.mapLat == null || this.mapLng == null) {
      return '';
    }
    return `${this.mapLat.toFixed(6)}, ${this.mapLng.toFixed(6)}`;
  }

  private async initializeGoogleMap(): Promise<void> {
    const apiKey = environment.googleMapsApiKey;
    if (!apiKey) {
      return;
    }

    await this.googleMapsLoaderService.load(apiKey);
    const g = (window as any).google;
    if (!g?.maps || !this.mapCanvas?.nativeElement) {
      return;
    }

    if (!this.googleMap) {
      this.googleMap = new g.maps.Map(this.mapCanvas.nativeElement, {
        center: { lat: this.mapLat ?? 24.7136, lng: this.mapLng ?? 46.6753 },
        zoom: 12,
      });

      this.googleMarker = new g.maps.Marker({
        map: this.googleMap,
        position: { lat: this.mapLat ?? 24.7136, lng: this.mapLng ?? 46.6753 },
        draggable: true,
      });

      this.googleMap.addListener('click', (event: any) => {
        this.updateLocationFromMap(event.latLng.lat(), event.latLng.lng());
      });
      this.googleMarker.addListener('dragend', (event: any) => {
        this.updateLocationFromMap(event.latLng.lat(), event.latLng.lng());
      });
      this.googleGeocoder = new g.maps.Geocoder();
    }

    g.maps.event.trigger(this.googleMap, 'resize');
    this.syncMarkerWithCurrentCoordinates();
    if (!this.selectedLocationDescription?.trim()) {
      this.reverseGeocode(this.mapLat ?? 24.7136, this.mapLng ?? 46.6753);
    }
  }

  private syncMarkerWithCurrentCoordinates(): void {
    if (!this.googleMap || !this.googleMarker || this.mapLat == null || this.mapLng == null) {
      return;
    }

    const position = { lat: this.mapLat, lng: this.mapLng };
    this.googleMap.setCenter(position);
    this.googleMarker.setPosition(position);
  }

  private updateLocationFromMap(lat: number, lng: number, fallbackDescription = ''): void {
    this.mapLat = lat;
    this.mapLng = lng;
    this.syncMarkerWithCurrentCoordinates();
    this.reverseGeocode(lat, lng, fallbackDescription);
  }

  private reverseGeocode(lat: number, lng: number, fallbackDescription = ''): void {
    if (!this.googleGeocoder) {
      this.selectedLocationDescription = fallbackDescription;
      return;
    }

    this.googleGeocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status === 'OK' && results?.length) {
        this.selectedLocationDescription = results[0].formatted_address;
        return;
      }
      this.selectedLocationDescription = fallbackDescription;
    });
  }
}
