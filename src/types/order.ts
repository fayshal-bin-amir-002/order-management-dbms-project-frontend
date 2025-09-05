export interface IProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOrderItem {
  product_id: string;
  quantity: number;
  _id: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  membership: "bronze" | "silver" | "gold";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDelivery {
  _id: string;
  order_id: string;
  delivered: boolean;
  date: string;
  shipping_method: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOrder {
  _id: string;
  customer_id: string;
  items: IOrderItem[];
  status: "pending" | "shipped" | "delivered" | "cancelled";
  ordered_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  customer_info: ICustomer;
  delivery_info: IDelivery;
  product_details: IProduct[];
}
