/**
 * Declarative columns for {@link AppEntityTableComponent} — reuse on other list pages.
 */
export type EntityTableColumnType = 'text' | 'date' | 'status';

export interface EntityTableColumn {
  field: string;
  headerKey: string;
  type?: EntityTableColumnType;
  sortable?: boolean;
  /** For `type: 'status'`: i18n key = `${statusTranslationPrefix}${cellValue}`. */
  statusTranslationPrefix?: string;
}
