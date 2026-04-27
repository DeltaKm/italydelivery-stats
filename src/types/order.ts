export interface OrderData {
  created_at: string;
  reference: string;
  customer: string;
  status: string;
  total_products: number;
  total_shipping: number;
}

export interface WeekGroup {
  weekRange: string;
  startDate: Date;
  endDate: Date;
  orders: OrderData[];
  totalOrders: number;
  totalProducts: number;
  totalShipping: number;
  orderCount: number;
  shippingCount: number;
}

export interface MonthGroup {
  month: string;
  monthDate: Date;
  weeks: WeekGroup[];
  totalOrders: number;
  totalProducts: number;
  totalShipping: number;
  orderCount: number;
  shippingCount: number;
}
