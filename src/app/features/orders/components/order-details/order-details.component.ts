import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../../core/services/order.service';
import { OrderDetailsResponse } from '../../../../core/models/order-details.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardModule,
    ButtonModule,
    TagModule,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  loading = false;
  orderId = '';
  details: OrderDetailsResponse | null = null;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') ?? '';
    if (!this.orderId) {
      this.router.navigate(['/my-orders']);
      return;
    }
    this.loadDetails();
  }

  loadDetails(): void {
    this.loading = true;
    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (res) => {
        this.details = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('error') || 'Error',
          detail:
            this.translate.instant('orderDetailsLoadError') ||
            'Failed to load order details.',
        });
      },
    });
  }

  get orderTypeText(): string {
    if (!this.details) return '—';
    return this.details.orderType?.trim() || '—';
  }

  get statusText(): string {
    if (!this.details) return '—';
    return this.details.statusName?.trim() || '—';
  }

  get statusSeverity(): string {
    const s = (this.details?.statusName || '').toLowerCase();
    if (s.includes('new') || s.includes('pending')) return 'warn';
    if (s.includes('done') || s.includes('completed') || s.includes('delivered'))
      return 'success';
    if (s.includes('cancel') || s.includes('reject') || s.includes('failed'))
      return 'danger';
    return 'info';
  }

  get orderTypeSeverity(): string {
    const t = (this.details?.orderType || '').toLowerCase();
    if (t.includes('cargo')) return 'info';
    if (t.includes('personal')) return 'success';
    if (t.includes('corporate')) return 'warn';
    return 'secondary';
  }

  get companyName(): string {
    return this.details?.carRental?.companyName || '—';
  }

  get originCity(): string {
    return this.details?.cargoShipping?.pickupAddress?.cityName || '—';
  }

  get destinationCity(): string {
    return this.details?.cargoShipping?.deliveryAddress?.cityName || '—';
  }

  get isCarRentalOrder(): boolean {
    return !!this.details?.carRental;
  }

  get isCargoShippingOrder(): boolean {
    return !!this.details?.cargoShipping;
  }

  get pickupSourceText(): string {
    const v = this.details?.carRental?.isFromHeadquarters;
    if (v == null) {
      return '—';
    }
    return v
      ? this.translate.instant('headquarters')
      : this.translate.instant('myLocation');
  }

  hasValue(value: unknown): boolean {
    if (value == null) {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  }
}
