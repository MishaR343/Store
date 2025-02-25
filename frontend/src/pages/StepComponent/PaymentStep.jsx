import { useState, useEffect } from "react";

const PaymentStep = ({ handleSubmit, handlePayment }) => {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const id = await handleSubmit(); // Отримуємо order_id з сервера
      setOrderId(id);
    };

    fetchOrder();
  }, [handleSubmit]);

  return (
    <div className="payment-step">
      <p>Натисніть "Перейти до оплати", щоб завершити оформлення замовлення.</p>
      {console.log(orderId)} {/* Логування для перевірки */}
      <button 
        onClick={() => handlePayment(orderId)} 
        className="next-button"
        disabled={!orderId} // Відключаємо кнопку, поки order_id не отримано
      >
        Перейти до оплати
      </button>
    </div>
  );
};

export default PaymentStep;
