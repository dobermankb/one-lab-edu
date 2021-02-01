import { ProductModel } from '@core/model/product.model';

export interface UserModel {
  uid: string;
  role: string;
  status: boolean;
  fullName?: string | null;
  username?: string | null;
  phoneNumber?: string | null;
  shopName?: string | null;
  // products?: ProductModel[];
}


