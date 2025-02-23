import React from 'react';
import PropTypes from 'prop-types';

function CartStep({ cart, removeFromCart, totalPrice }) {
  return (
    <div className="step-content">
      <h2>Товари в кошику</h2>
      {cart.length === 0 ? (
        <p>Ваш кошик порожній.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image_base64?.[0] ? `data:image/jpeg;base64,${item.image_base64[0]}` : '/placeholder.jpg'}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Ціна: ${parseFloat(item.price).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} className="remove-button">
                  Видалити
                </button>
              </div>
            </div>
          ))}
          <p>Разом: ${parseFloat(totalPrice).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

// Визначення PropTypes
CartStep.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image_base64: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

export default CartStep;
