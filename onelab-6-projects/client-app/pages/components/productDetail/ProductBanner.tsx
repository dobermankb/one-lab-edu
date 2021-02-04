import React, { useState } from "react";

interface Props {
  images: string[];
}

const ProductBanner = ({ images }: Props) => {
  const [index, setIndex] = useState(0);
  function scrollLeft(): void {
    if (index === 0) {
      setIndex(images.length);
    }
    setIndex(prevState => prevState - 1);
  }

  function scrollRight(): void {
    if (index === images.length - 1) {
      setIndex(-1);
    }
    setIndex(prevState => prevState + 1);
  }

  return (
    <div className="product-banner">
      {images.length === 0 ? null : (
        <div className="banner-image">
          <img src={require(`../data/images/${images[index]}`)} alt="banner" />
          {images.length > 1 && (
            <div className="banner-arrow">
              <span onClick={() => scrollLeft()} className="banner-arrow-left">
                &lt;
              </span>
              <span
                onClick={() => scrollRight()}
                className="banner-arrow-right"
              >
                &gt;
              </span>
            </div>
          )}
        </div>
      )}

      <div className="banner-image-container">
        {images.map((image, i) => (
          <img
            className="banner-image-selector"
            src={require(`../data/images/${image}`)}
            alt="banner"
            onClick={() => setIndex(i)}
            style={{ border: i === index ? "1px solid black" : "none" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductBanner;