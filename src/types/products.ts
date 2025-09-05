export interface IProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerOrderedProduct {
  _id: string;
  name: string;
  email: string;
  membership: "bronze" | "silver" | "gold" | "platinum";
}
