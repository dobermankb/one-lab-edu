import { DeliveryOptionsModel } from '@core/model/delivery-options.model';
import { ProductParameters } from '@core/model/parameters.model';

export interface ProductModel {
  uid: string;
  barcode: string;
  userUid: string;
  internalUid: string;
  price: number;
  deliveryOptions: DeliveryOptionsModel;

  categoryName: string;
  description: string;
  name: string;
  parameters: ProductParameters;
  status: boolean;
}
