export interface OrderDetailsResponse {
  id: string;
  requestNo?: string | null;
  createdOnUtc?: string | null;
  orderType?: string | null;
  statusName?: string | null;
  paymentMethodName?: string | null;
  cancelReason?: string | null;
  images?: string[] | null;
  carRental?: {
    companyName?: string | null;
    carTypeName?: string | null;
    shipmentTypeName?: string | null;
    weightInTonName?: string | null;
    palletCapacityName?: string | null;
    rentDurationName?: string | null;
    dryBoxTypeName?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    isFromHeadquarters?: boolean | null;
    pickupPlaceName?: string | null;
    pickupStreet?: string | null;
    deliveryAddress?: {
      cityName?: string | null;
      provinceName?: string | null;
      placeName?: string | null;
      street?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    } | null;
  } | null;
  cargoShipping?: {
    pickupAddress?: {
      cityName?: string | null;
      provinceName?: string | null;
      street?: string | null;
      placeName?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    } | null;
    deliveryAddress?: {
      cityName?: string | null;
      provinceName?: string | null;
      street?: string | null;
      placeName?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    } | null;
    receiver?: {
      name?: string | null;
      phone?: string | null;
    } | null;
    shipmentDetails?: {
      weight?: number | null;
      pieces?: number | null;
      requestTypeName?: string | null;
      shipmentTypeName?: string | null;
      shipmentSpeed?: string | null;
      length?: number | null;
      width?: number | null;
      height?: number | null;
      privateTripDetails?: {
        carTypeName?: string | null;
        weightInTonName?: string | null;
        palletCapacityName?: string | null;
        dryBoxTypeName?: string | null;
      } | null;
      additionalNotes?: string | null;
    } | null;
    deliveryDate?: string | null;
    images?: string[] | null;
  } | null;
  [key: string]: unknown;
}
