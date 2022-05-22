export interface BasketItem {
  productId: number;
  name: string;
  price: number;
  pictureUrl?: any;
  brand?: any;
  type: string;
  quantity: number;
}

export interface Basket {
  id: number;
  buyerId: string;
  items: BasketItem[];
}
