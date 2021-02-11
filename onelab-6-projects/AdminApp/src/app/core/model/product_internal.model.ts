import { ProductParameters } from '@core/model/parameters.model';

export interface ProductInternalModel {
  uid: string;
  categoryName: string;
  barcode: string;
  description: string;
  name: string;
  parameters: ProductParameters;
  status: boolean;
}
