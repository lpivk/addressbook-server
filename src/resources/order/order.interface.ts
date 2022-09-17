export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export interface IOrder {
  products: Product[];
  userId: string;
}
