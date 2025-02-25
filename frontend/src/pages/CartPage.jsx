import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

export default function CartPage() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setRedirectMessage } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setRedirectMessage('Будь ласка, увійдіть, щоб продовжити оформлення замовлення.');
      navigate('/');
      return;
    }
  
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
        setCartItems(response.data.map(item => ({
          ...item,
          quantity: item.quantity || 1,
          image_base64: item.image_base64 && Array.isArray(item.image_base64) ? item.image_base64[0] : item.image_base64 || ""
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, [user, navigate, setRedirectMessage]);
  const handleQuantityChange = async (productId, amount) => {

    const updatedItem = cartItems.find(item => item.id === productId);
    if (!updatedItem) return;
    
    const newQuantity = Math.max(1, (updatedItem.quantity + amount));
    console.log(user.id, productId, newQuantity);

    try {
      const response = await axios.put('http://localhost:5000/api/cart/update-quantity', {
        user_id: parseInt(user.id),
        product_id: parseInt(productId),
        quantity: parseInt(newQuantity)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      

      if (response.status === 200) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    }
  };

  const handleRemoveFromCart = async (cartId, productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/rm/${cartId}/${productId}`);
      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
    }
  };

  const handleCheckout = () => {
    navigate('/cart/checkout');
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className="page">
      <Header />
      <div className="cart-page-main-content">
        <h2 className="cart-title">Ваш кошик</h2>
        <div className="cart-items-list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image_base64 ? `data:image/jpeg;base64,${item.image_base64}` : "path/to/default-image.jpg"} 
                  alt={item.name} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>Ціна: {parseFloat(item.price).toFixed(2)} грн</p>
                  <div className="quantity-controls">
                    <button className="quantity-button" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span className="quantity-text">{item.quantity}</span>
                    <button className="quantity-button" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.cart_id, item.id)} className="remove-from-cart-button">Видалити</button>
                </div>
              </div>
            ))
          ) : (
            <p>Ваш кошик порожній</p>
          )}
        </div>
        <div className="cart-total">
          <p>Загальна сума: {cartItems.reduce((total, item) => total + parseFloat(item.price) * (item.quantity || 1), 0).toFixed(2)} грн</p>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>Оформити замовлення</button>
      </div>
      <Footer />
    </div>
  );
}
