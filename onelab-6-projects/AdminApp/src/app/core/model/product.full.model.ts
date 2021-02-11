import { DeliveryOptionsModel } from '@core/model/delivery-options.model';
import { ProductParameters } from '@core/model/parameters.model';

export interface IProductFull {
  productUid: string;
  userUid: string;
  internalUid: string;
  price: number;
  deliveryOptions: DeliveryOptionsModel;
  categoryName: string;
  barcode: string;
  description: string;
  name: string;
  parameters: ProductParameters;
  status: boolean;
}
