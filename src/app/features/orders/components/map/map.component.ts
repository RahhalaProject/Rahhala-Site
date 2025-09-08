import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  template: `<div #map style="height: 500px; width: 100%;"></div>`,
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  @ViewChild('map', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Initialize map centered on Egypt
    this.map = L.map('map').setView([26.8206, 30.8025], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Add a marker in Cairo
    L.marker([30.0444, 31.2357])
      .addTo(this.map)
      .bindPopup('<b>القاهرة</b><br>عاصمة مصر')
      .openPopup();
  }
}
