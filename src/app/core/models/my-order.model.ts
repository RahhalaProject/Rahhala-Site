/**
 * GET /api/v1/Order/my-orders — `MyOrderResponse` (swagger).
 */
export interface MyOrderResponse {
  orderId: string;
  orderNumber: string | null;
  orderDate: string;
  /** `OrderType` enum (int). */
  orderType: number;
  orderTypeName: string | null;
  originCity: string | null;
  destinationCity: string | null;
  companyName: string | null;
  /** `OrderStatus` enum (int). */
  statusId: number;
}
