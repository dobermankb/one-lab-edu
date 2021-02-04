import react from "react";
import {ProductPartner} from "../data/interfaces";

interface Props {
  productPartner: ProductPartner;
}

export default function producDetail({productPartner}: Props){
  return (
    <div className="product-details">
      <div className="product-partner-info">
        <h1>{productPartner.title}</h1>
        <div className="product-partner-description">
          <h3>Description</h3>
          <p>
            Initial Info = 0 
          </p>
        </div>
      </div>
    </div>
  );
};
