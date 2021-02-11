import { DeliveryOptionsModel } from '@core/model/delivery-options.model';

export interface UserModel {
  uid: string;
  role: string;
  status: boolean;
  fullName: string;
  username: string;
  phoneNumber: string;
  shopName: string;
  deliveryOptions: DeliveryOptionsModel;
}


