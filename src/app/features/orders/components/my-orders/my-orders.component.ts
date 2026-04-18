import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../../core/services/order.service';
import { MyOrderResponse } from '../../../../core/models/my-order.model';
import { AppEntityTableComponent } from '../../../../shared/components/app-entity-table/app-entity-table.component';
import { EntityTableColumn } from '../../../../shared/models/entity-table-column.model';

export interface OrderStatusFilterOption {
  label: string;
  value: number | null;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    Select,
    TranslateModule,
    AppEntityTableComponent,
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly translate = inject(TranslateService);
  private readonly messageService = inject(MessageService);

  orders: MyOrderResponse[] = [];
  loading = false;

  /** null = all statuses (no query param). */
  selectedOrderStatus: number | null = null;
  statusFilterOptions: OrderStatusFilterOption[] = [];

  readonly tableColumns: EntityTableColumn[] = [
    {
      field: 'orderNumber',
      headerKey: 'orderNumber',
      type: 'text',
    },
    {
      field: 'orderDate',
      headerKey: 'orderDate',
      type: 'date',
    },
    {
      field: 'orderTypeName',
      headerKey: 'orderType',
      type: 'text',
    },
    {
      field: 'originCity',
      headerKey: 'originCity',
      type: 'text',
    },
    {
      field: 'destinationCity',
      headerKey: 'destinationCity',
      type: 'text',
    },
    {
      field: 'companyName',
      headerKey: 'orderCompany',
      type: 'text',
    },
    {
      field: 'statusId',
      headerKey: 'orderStatus',
      type: 'status',
      statusTranslationPrefix: 'orderStatus_',
    },
  ];

  readonly globalFilterFields = this.tableColumns.map((c) => c.field);

  ngOnInit(): void {
    this.buildStatusFilterOptions();
    this.translate.onLangChange.subscribe(() => {
      this.buildStatusFilterOptions();
    });
    this.loadOrders();
  }

  private buildStatusFilterOptions(): void {
    const all: OrderStatusFilterOption = {
      label: this.translate.instant('orderStatusAll'),
      value: null,
    };
    const rest: OrderStatusFilterOption[] = [1, 2, 3, 4, 5, 6].map((id) => ({
      label: this.translate.instant(`orderStatus_${id}`),
      value: id,
    }));
    this.statusFilterOptions = [all, ...rest];
  }

  onStatusFilterChange(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService
      .getMyOrders(
        this.selectedOrderStatus == null ? undefined : this.selectedOrderStatus
      )
      .subscribe({
        next: (data) => {
          const list = data ?? [];
          this.orders = list.map((o) => ({
            ...o,
            orderTypeName:
              o.orderTypeName?.trim() ||
              this.translate.instant(`orderType_${o.orderType}`),
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.orders = [];
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('error') || 'Error',
            detail:
              this.translate.instant('myOrdersLoadError') ||
              'Failed to load orders.',
          });
        },
      });
  }
}
