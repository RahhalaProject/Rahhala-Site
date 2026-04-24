import {
  Component,
  Input,
  inject,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { EntityTableColumn } from '../../models/entity-table-column.model';

/**
 * Reusable PrimeNG data table: client-side sort, global search, pagination.
 * Pass {@link EntityTableColumn} definitions for new list screens.
 */
@Component({
  selector: 'app-entity-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TableModule,
    InputTextModule,
    TagModule,
    ButtonModule,
  ],
  providers: [DatePipe],
  templateUrl: './app-entity-table.component.html',
  styleUrl: './app-entity-table.component.scss',
})
export class AppEntityTableComponent {
  private readonly datePipe = inject(DatePipe);
  private readonly translate = inject(TranslateService);

  @ViewChild('dt') private dt?: Table;

  /** Row data (plain objects from API). */
  @Input() items: unknown[] = [];

  @Input() columns: EntityTableColumn[] = [];

  /**
   * Unique row field for PrimeNG (`dataKey`). Recommended when rows have stable ids.
   */
  @Input() dataKey?: string;

  @Input() loading = false;

  @Input() rowsPerPage = 10;

  @Input() rowsPerPageOptions: number[] = [10, 25, 50];

  /** i18n key for search placeholder. */
  @Input() searchPlaceholderKey = 'entityTableSearchPlaceholder';

  /** i18n key when there are no rows. */
  @Input() emptyMessageKey = 'entityTableEmpty';

  /** Fields included in global filter (usually same as column fields). */
  @Input() globalFilterFields: string[] = [];
  @Output() rowAction = new EventEmitter<{ action: string; row: unknown }>();

  /**
   * Use in all `p-table` templates (header/body). PrimeNG injects a template variable
   * named `columns` in several contexts, which shadows `@Input() columns`.
   */
  get colDefs(): EntityTableColumn[] {
    return this.columns;
  }

  onGlobalFilter(table: Table, event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    table.filterGlobal(v, 'contains');
  }

  formatCell(row: unknown, col: EntityTableColumn): string {
    const r = row as Record<string, unknown>;
    const v = r[col.field];
    if (v === null || v === undefined || v === '') {
      return '—';
    }
    if (col.type === 'date') {
      const d = typeof v === 'string' ? v : String(v);
      const lang = this.translate.currentLang || this.translate.getDefaultLang();
      return (
        this.datePipe.transform(d, 'medium', undefined, lang) ?? String(v)
      );
    }
    if (col.type === 'status' && col.statusTranslationPrefix) {
      const key = `${col.statusTranslationPrefix}${v}`;
      const t = this.translate.instant(key);
      return t !== key ? t : String(v);
    }
    return String(v);
  }

  isTagColumn(col: EntityTableColumn): boolean {
    return col.type === 'status' || col.type === 'tag';
  }

  isActionColumn(col: EntityTableColumn): boolean {
    return col.type === 'action';
  }

  getTagSeverity(row: unknown, col: EntityTableColumn): string | undefined {
    if (!this.isTagColumn(col) || !col.tagSeverityMap) {
      return undefined;
    }
    const r = row as Record<string, unknown>;
    const severityField = col.tagSeverityField || col.field;
    const raw = r[severityField];
    if (raw === null || raw === undefined) {
      return undefined;
    }
    return col.tagSeverityMap[String(raw)];
  }

  onRowAction(col: EntityTableColumn, row: unknown): void {
    const action = col.actionName || 'action';
    this.rowAction.emit({ action, row });
  }

  trackByField(index: number, col: EntityTableColumn): string {
    return col.field;
  }
}
