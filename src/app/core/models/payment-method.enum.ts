/**
 * Matches backend PaymentMethod enum. UI stores numeric values; API payload uses enum names ("Cash", "Visa", "Walet").
 */
export enum PaymentMethod {
  Cash = 1,
  Visa = 2,
  Walet = 3,
}
