export interface Product {
    barcode: string;
    categoryNames: string[];
    description: string;
    imageUrl: string[];
    name: string;
    price: number;
    uid: string;
    userUid: string[];
  }
  
  export interface ProductPartner {
    id: number;
    title: string;
    type: string;
    image: string;
  }