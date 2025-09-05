export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  membership: "bronze" | "silver" | "gold" | "platinum";
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  product_id: string;
  quantity: number;
  _id: string;
}

export interface IProductDetail {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDeliveryInfo {
  _id: string;
  order_id: string;
  delivered: boolean;
  date: string; // ISO date string
  shipping_method: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOrderCustomer {
  _id: string;
  customer_id: string;
  items: IOrderItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; // extendable
  ordered_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  product_details: IProductDetail[];
  delivery_info: IDeliveryInfo;
}
