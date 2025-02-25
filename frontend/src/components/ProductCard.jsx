import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/ProductCard.css";

const ProductCard = ({ id }) => {
  const [productInfo, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);

        // Check if the product is already in the user's cart
        if (user) {
          const cartResponse = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
          console.log(cartResponse.data);
          const isProductInCart = cartResponse.data.some(item => item.id === id);
          setAddedToCart(isProductInCart);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Будь ласка, увійдіть, щоб додати товар у кошик.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/cart/${user.id}`, {
        product_id: productInfo.id,
        user_id: user.id,
      });
      if (response.status === 201) {
        setAddedToCart(true); // Mark the product as added to the cart
      }
    } catch (err) {
      console.error("Помилка при додаванні товару в кошик", err);
    }
  };

  const base64Images = productInfo?.image_base64?.map((img) => `data:image/jpeg;base64,${img}`) || [];

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        {base64Images.length > 0 ? (
          <img src={base64Images[0]} alt={productInfo?.name} className="product-image" />
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
      <div className="button-container">
        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={addedToCart}>
          {addedToCart ? "Товар додано в кошик" : "Додати у кошик"}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProductCard;
