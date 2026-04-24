/**
 * Declarative columns for {@link AppEntityTableComponent} — reuse on other list pages.
 */
export type EntityTableColumnType = 'text' | 'date' | 'status' | 'tag' | 'action';

export interface EntityTableColumn {
  field: string;
  headerKey: string;
  type?: EntityTableColumnType;
  sortable?: boolean;
  /** For `type: 'status'`: i18n key = `${statusTranslationPrefix}${cellValue}`. */
  statusTranslationPrefix?: string;
  /**
   * For `type: 'status' | 'tag'`: field used to resolve tag color.
   * Defaults to `field` when omitted.
   */
  tagSeverityField?: string;
  /**
   * For `type: 'status' | 'tag'`: maps raw field value to PrimeNG tag severity.
   * Example: `{ '1': 'success', '2': 'warn' }`
   */
  tagSeverityMap?: Record<string, string>;
  /** For `type: 'action'`: unique action id emitted to parent. */
  actionName?: string;
  /** For `type: 'action'`: PrimeIcons class (e.g. `pi pi-eye`). */
  actionIcon?: string;
  /** For `type: 'action'`: optional translated tooltip key. */
  actionLabelKey?: string;
}
