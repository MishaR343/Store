import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ id }) => {
  const [productInfo, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const base64Images = productInfo?.image_base64?.map((img) => `data:image/jpeg;base64,${img}`) || [];

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        {base64Images.length > 0 ? (
          <img src={base64Images[0]} alt={productInfo?.name} className="product-image" /> /*виправити контур фото*/
        ) : (
          <div className="no-image"></div>
        )}
      </div>
      <h2 className="product-name">{productInfo?.name ?? "Ім'я товару"}</h2>
      <p className="product-description">{productInfo?.description ?? "Опис товару"}</p>
      <p className="product-price">
        Ціна: <span className="price">{productInfo?.price ?? "Ціна"} грн</span>
      </p>
      {productInfo?.stock_quantity > 0 ? (
        <p className="product-stock">В наявності: {productInfo.stock_quantity}</p>
      ) : (
        <p className="product-stock out-of-stock">Немає в наявності</p>
      )}
      <button className="add-to-cart-btn">Додати у кошик</button> {/*обробити кнопку*/}
    </div>
  );
};

ProductCard.propTypes = {
  id: PropTypes.string.isRequired
};

export default ProductCard;
