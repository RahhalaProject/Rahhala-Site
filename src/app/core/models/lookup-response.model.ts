import { LookupItem } from './lookup-item.model';

/**
 * API response shape for get-loockups-by-categories-ids.
 * Keys are category names (RequestType, PaymentMethod, etc.).
 */
export type LookupResponse = Partial<{
  RequestType: LookupItem[];
  PaymentMethod: LookupItem[];
  RentDuration: LookupItem[];
  CarType: LookupItem[];
  ShipmentType: LookupItem[];
  WeightInTon: LookupItem[];
  PalletCapacity: LookupItem[];
  PrivateCar: LookupItem[];
}>;
