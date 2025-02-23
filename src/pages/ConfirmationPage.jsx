import React from 'react';
import PropTypes from 'prop-types';
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import '../styles/CheckoutPage.css'; // Використаємо ті самі стилі, щоб зберегти дизайн

function ConfirmationPage({ orderDetails, onClose }) {
  return (
    <div className="page">
      <Header />
        <div className="step-content confirmation-page">
          <h2>Order Confirmation</h2>
          <p>Thank you for your order! Here are the details:</p>
          {/* <div className="order-details">
            <h3>Order ID: {orderDetails.order_id}</h3>
            <h3>Total Price: ${orderDetails.total_price.toFixed(2)}</h3>
            <h4>Contact Information:</h4>
            <p>Name: {orderDetails.contact_info.name}</p>
            <p>Email: {orderDetails.contact_info.email}</p>
            <p>Phone: {orderDetails.contact_info.phone}</p>
            <h4>Shipping Information:</h4>
            <p>Address: {orderDetails.shipping_info.address}</p>
            <p>City: {orderDetails.shipping_info.city}</p>
            <p>Shipping Method: {orderDetails.shipping_info.method}</p>
            <h4>Payment Method:</h4>
            <p>{orderDetails.payment_method_name}</p>
            <h4>Items:</h4>
            <ul>
              {orderDetails.cart_items.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
          <button onClick={onClose} className="next-button">
            Close
          </button> */}
        </div>
      <Footer />
    </div>
  );
}

ConfirmationPage.propTypes = {
  orderDetails: PropTypes.shape({
    order_id: PropTypes.string.isRequired,
    total_price: PropTypes.number.isRequired,
    contact_info: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    shipping_info: PropTypes.shape({
      address: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
    }).isRequired,
    payment_method_name: PropTypes.string.isRequired,
    cart_items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConfirmationPage;
