import React, { useState, useEffect } from "react";
import * as products_data from "./products.json";
import { RouteComponentProps, withRouter } from "react-router";
import { ProductData } from "../data/Interfaces";
import { modifyItem } from "../cart/CartLogic";
import ProductDetails from "./ProductDetails";
import "./productDetails.css";

interface Props extends RouteComponentProps<{ id?: string }> {
  reload: () => void;
}

const initialProduct: ProductData = {
  id: 0,
  sku: 0,
  title: "",
  type: "",
  feature: [],
  brand: "",
  color: [],
  image: [],
  price: 0
};

const Product: React.FC<Props> = props => {
  const [product, setProduct] = useState(initialProduct);
  const [color, setColor] = useState("");

  useEffect(() => {
    const data: ProductData[] = products_data.data;
    for (let item of data) {
      if (item.sku.toString() === props.match.params.id) {
        setProduct(item);
        setColor(item.color[0]);
      }
    }
  }, [props.match.params.id]);

  function addToCart(count: number): void {
    modifyItem(product, color, count);

    props.reload();
  }
  return (
    <>
    <div>
      <div className="product-bar">
        <button className="product-back" onClick={() => props.history.go(-1)}>
          &lt; back
        </button>
      </div>
      <ProductDetails
        product={product}
        selectedColor={color}
        setColor={setColor}
        addToCart={addToCart}
      />
    </div>
    </>
  );
};

export default withRouter(Product);
