import { PaymentMethod } from './payment-method.enum';

export interface AddressRequest {
  cityId: string | null;
  provinceId: string | null;
  street: string | null;
  placeName: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ReceiverRequest {
  name: string | null;
  phone: string | null;
}

export interface ShipmentDetailsRequest {
  description: string | null;
  requestTypeId: string | null;
  weight: number | null;
  pieces: number | null;
  shipmentTypeId: string | null;
  privateTripDetails?: {
    carTypeId?: string | null;
    weightInTonId?: string | null;
    palletCapacityId?: string | null;
    dryBoxTypeId?: number | null;
  } | null;
  shipmentSpeed: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  additionalNotes: string | null;
}

export interface CreateCargoShippingOrderRequest {
  pickupAddress: AddressRequest;
  deliveryAddress: AddressRequest;
  receiver: ReceiverRequest;
  shipmentDetails: ShipmentDetailsRequest;
  deliveryDate: string | null;
  recieveDate: string | null;
  /** Backend PaymentMethod enum value: 1 Cash, 2 Visa, 3 Walet. */
  paymentMethod: PaymentMethod | null;
  images: string[];
}

/** Response from POST /FileUpload/multiple-Image — use `fileNames` as `images` on create order. */
export interface MultipleImageUploadResponse {
  fileNames: string[];
}

export interface CargoShippingOrderResponse {
  id: string;
  requestNo: string | null;
  status: string | null;
  pickupAddress: AddressRequest;
  deliveryAddress: AddressRequest;
  receiver: ReceiverRequest;
  shipmentDetails: ShipmentDetailsRequest;
  deliveryDate: string;
  recieveDate?: string | null;
  paymentMethod: string | null;
  orderTypeId: string;
  images: string[] | null;
}
