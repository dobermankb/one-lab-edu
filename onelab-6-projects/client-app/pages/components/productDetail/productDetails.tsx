import react from "react";
import {Product} from "../data/interfaces";
import ProductBanner from "./ProductBanner";

interface Props {
  product: Product;
  addToCart?: (count: number) => void | undefined;
}

const productDetails = ({product, addToCart}: Props) => {
  return (
    <div className="product-details">
      <ProductBanner images={product.image} />
      <div className="product-info">
        <h1>{product.title}</h1>
        <h2 className="product-price">${product.price}</h2>
        <div className="product-features">
          <h3>Features</h3>
          <ul>
            {product.feature.length !== 0 ? (
              product.feature.map(feature => <li>{feature}</li>)
            ) : (
              <li>no features</li>
            )}
          </ul>
        </div>
        <div className="product-description">
          <h3>Description</h3>
          <p>
            Initial Info = 0 
          </p>
        </div>
      
        <div className="product-add">
          <div className="product-count">
          </div>
          <button className="cart-add-button" /*onClick={() => addToCart(count)}*/>
            add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default productDetails;