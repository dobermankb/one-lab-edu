import React from "react";
import react from "react";
import {Product} from "../data/interfaces";
import ProductBanner from "./ProductBanner";
import ProductPartnerList from "./productPatrnerList"

interface Props {
  product: Product;
}

const productDetails = ({product}: Props) => {
  return (
    <div className="product-details">
      <ProductBanner images={product.imageUrl} />
      <div className="product-info">
        <h1>{product.name}</h1>
        <h2 className="product-price">${product.price}</h2>
        <div className="product-features">
          <h3>Features</h3>
          <ul>
            {product.description.length !== 0 ? (<li>{product.description}</li>): 
            (
              <li>no features</li>
            )}
          </ul>
        </div>
        <div className="product-add">
          <div className="product-count">
          </div>
          <button className="cart-add-button" /*onClick={() => addToCart(count)}*/>
            add to cart
          </button>
        </div>
      </div>
      <div className= "product-partner-list">
      <ProductPartnerList list= {product.userUid}/>
      </div>
    </div>
  );
};

export default productDetails;