import { CategoryModel } from '@core/model/category.model';

export interface ProductModel {
  uid: string;
  usersUid: string[];
  categories: CategoryModel[];
  name: string;
  barcode: string;
  imageUrl: string;
  price: string;
  description: string;
}
