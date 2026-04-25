import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { SlidersService } from '../../../../core/services/sliders.service';
import { SliderItem } from '../../../../core/models/slider.model';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'our-services',
  styleUrls: ['./our-services.component.scss'],
  templateUrl: './our-services.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TranslateModule,
    RouterModule,
    DialogModule,
  ],
})
export class OurServicesComponent implements OnInit {
  readonly fallbackSliderImage = '/icons/AlrahalaLogo.svg';
  private readonly slidersService = inject(SlidersService);
  private readonly translate = inject(TranslateService);

  sliders: SliderItem[] = [];
  loading = false;
  loadError = false;

  visibleSliderDialog = false;
  selectedSliderDetails: SliderItem | null = null;
  detailsLoading = false;
  detailsLoadError = false;

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.loading = true;
    this.loadError = false;

    this.slidersService
      .getSliders()
      .pipe(
        catchError((err) => {
          this.loadError = true;
          return of<SliderItem[]>([]);
        })
      )
      .subscribe((items) => {
        this.sliders = items ?? [];
        this.loading = false;
      });
  }

  openSliderDetails(sliderId: string): void {
    if (!sliderId) {
      return;
    }

    this.visibleSliderDialog = true;
    this.detailsLoading = true;
    this.detailsLoadError = false;
    this.selectedSliderDetails = null;

    this.slidersService
      .getSliderDetails(sliderId)
      .pipe(
        catchError((err) => {
          this.detailsLoadError = true;
          return of<SliderItem | null>(null);
        })
      )
      .subscribe((details) => {
        this.selectedSliderDetails = details;
        this.detailsLoading = false;
      });
  }

  getLocalizedTitle(item: SliderItem | null | undefined): string {
    if (!item) {
      return '';
    }

    const isArabic = (this.translate.currentLang || '').startsWith('ar');
    if (isArabic) {
      return item.titleAr || item.title || item.titleEn || '';
    }

    return item.titleEn || item.title || item.titleAr || '';
  }

  getLocalizedDescription(item: SliderItem | null | undefined): string {
    if (!item) {
      return '';
    }

    const isArabic = (this.translate.currentLang || '').startsWith('ar');
    if (isArabic) {
      return item.descriptionAr || item.description || item.descriptionEn || '';
    }

    return item.descriptionEn || item.description || item.descriptionAr || '';
  }

  trackBySliderId(index: number, item: SliderItem): string {
    return item.id || String(index);
  }

  getSliderImageUrl(item: SliderItem | null | undefined): string | null {
    const raw = item?.imageUrl?.trim();
    if (!raw || raw.toLowerCase() === 'string') {
      return null;
    }
    return raw;
  }

  onSliderImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) {
      return;
    }

    // Prevent infinite fallback loops if fallback path is unavailable.
    if (img.src.includes(this.fallbackSliderImage)) {
      img.style.display = 'none';
      return;
    }

    img.src = this.fallbackSliderImage;
  }
}
