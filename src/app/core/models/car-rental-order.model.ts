import { DryBoxType } from './dry-box-type.enum';
import { PaymentMethod } from './payment-method.enum';

/** Matches `CarRentalDeliveryAddressRequest` when `isFromHeadquarters` is false. */
export interface CarRentalDeliveryAddressRequest {
  street?: string | null;
  placeName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Car rental order payloads for POST /api/v1/CarRentalOrder/personal and .../corporate
 */
export interface CreatePersonalCarRentalOrderRequest {
  carTypeId: string;
  shipmentTypeId: string;
  weightInTonId: string;
  palletCapacityId: string;
  rentDurationId: string;
  /** Required when shipment type has `key === "Dry"`. */
  dryBoxTypeId?: DryBoxType;
  fromDate: string;
  toDate: string;
  isFromHeadquarters: boolean;
  /** When picking up from customer location (`isFromHeadquarters: false`). */
  deliveryAddress?: CarRentalDeliveryAddressRequest | null;
  paymentMethod: PaymentMethod | null;
  images: string[];
}

export interface CreateCorporateCarRentalOrderRequest
  extends CreatePersonalCarRentalOrderRequest {
  companyName: string;
}

export interface CarRentalOrderResponse {
  id?: string;
  requestNo?: string | null;
  status?: string | null;
}
