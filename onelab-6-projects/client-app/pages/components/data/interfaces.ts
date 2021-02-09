export interface Product {
  id: number;
  title: string;
  type: string;
  feature: string[];
  brand: string;
  image: string[];
  price: number;
}

export interface ProductPartner {
  id: number;
  title: string;
  type: string;
  image: string;
}