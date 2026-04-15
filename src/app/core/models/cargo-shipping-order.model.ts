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
  weight: number;
  pieces: number;
  shipmentTypeId: string | null;
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
  paymentMethod: string | null;
  orderTypeId: string | null;
  images: string[];
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
  paymentMethod: string | null;
  orderTypeId: string;
  images: string[] | null;
}
