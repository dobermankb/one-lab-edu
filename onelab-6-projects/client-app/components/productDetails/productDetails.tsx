import React from "react";
import Link from 'next/link';
import Image from 'next/image';

import {makeStyles} from '@material-ui/core/styles';

import ProductPartnerList from "./productPartnerList"

interface Props {
  barcode: number;
  categoryName: string;
  deliveryOptions: 
    {
      delivery: boolean;
      pickup: boolean;
    };
  description: string;
  internalUid: string;
  name: string;
  price: string;
  status: boolean;
  uid: string;
  userUid: string;
  image: string;
}

export default function productDetails(
  { barcode, 
    categoryName, 
    deliveryOptions, 
    description,
    internalUid,
    name,
    price,
    status,
    uid,
    userUid,
    image
  }
  : Props)
  {
  return (
    <Link href={`/product/${uid}`}>
      <div className="product-bar">
        <button className="product-back" onClick={() => {}}>
          &lt; back
        </button>
      </div>
      <div className="product-details">
        <div className="product-image">
            <Image src={image} width="200" height="200" />
        </div>
        <div className="product-info">
          <h1>{name}</h1>
          <h2 className="product-price">${price}</h2>
          <div className="product-features">
            <h3>Features:</h3>
            <ul>
              {description.length !== 0 ? (<li>{description}</li>): (<li>no features</li>)}
            </ul>
          </div>
          <div className="product-add">
            <button className="cart-add-button" /*onClick={() => addToCart(count)}*/>
              add to cart
            </button>
          </div>
        </div>
        <div className= "product-partner-list">
          <ProductPartnerList userUid= {userUid}/>
        </div>
      </div>
    </Link>
  );
};
