import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import ProgressBar from '../components/Component/ProgressBar';
import CartStep from './StepComponent/CartStep';
import ContactStep from './StepComponent/ContactStep';
import ShippingStep from './StepComponent/ShippingStep';
import PaymentStep from './StepComponent/PaymentStep';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';

const schema = yup.object().shape({
  contactName: yup.string().required('Ім\'я є обов\'язковим').min(2, 'Ім\'я повинно містити не менше 2 символів'),
  contactEmail: yup.string().email('Невірний email').required('Email є обов\'язковим'),
  contactPhone: yup.string().matches(/^\+?[\d\s-]{10,}$/, 'Невірний номер телефону').required('Телефон є обов\'язковим'),
  shippingAddress: yup.string().required('Адреса є обов\'язковою').min(5, 'Адреса повинна містити не менше 5 символів'),
  shippingCity: yup.string().required('Місто є обов\'язковим').min(2, 'Місто повинно містити не менше 2 символів'),
  shippingMethod: yup.string().required('Спосіб доставки є обов\'язковим'),
  cardNumber: yup.string().matches(/^\d{16}$/, 'Невірний номер картки (16 цифр)').required('Номер картки є обов\'язковим'),
  cardExpiry: yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Невірна дата закінчення (MM/YY)').required('Дата закінчення є обов\'язковою'),
  cardCvv: yup.string().matches(/^\d{3,4}$/, 'Невірний CVV (3-4 цифри)').required('CVV є обов\'язковим'),
});

function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [stripeToken, setStripeToken] = useState(null); 

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [message, setMessage] = useState('');
  const baseUrl = 'http://localhost:5000';

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // Дозволяє валідацію в реальному часі
  });
  const { formState: { isValid } } = methods;
  
  const totalSteps = 4;

  useEffect(() => {
    if (!user) {
      setMessage('Будь ласка, увійдіть, щоб продовжити оформлення замовлення.');
      return;
    }
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cart/${user.id}`);
        setCart(response.data);
      } catch (error) {
        setMessage('Не вдалося завантажити кошик.');
      }
    };
    fetchCart();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/payment-methods`);
        setPaymentMethods(response.data);
      } catch (error) {
        setMessage('Не вдалося завантажити способи оплати.');
      }
    };
    fetchPaymentMethods();
  }, [user]);

  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  const stepFields = {
    1: [],
    2: ["contactName", "contactEmail", "contactPhone"],
    3: ["shippingAddress", "shippingCity", "shippingMethod"],
    4: ["cardNumber", "cardExpiry", "cardCvv"],
  };
  
  const handleNext = async () => {
    if (step === 1) {
      if (cart.length === 0) {
        setMessage("Ваш кошик порожній. Додайте товари, щоб продовжити.");
        return;
      }
      setStep(step + 1);
      return;
    }
  
    const fieldsToValidate = stepFields[step] || [];
    if (fieldsToValidate.length > 0) {
      const isStepValid = await methods.trigger(fieldsToValidate);
      if (!isStepValid) {
        return;
      }
    }
  
    setStep(step + 1);
  };
  

  const handlePrev = () => {
    setMessage('');
    setStep(step - 1);
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      setMessage('Будь ласка, увійдіть, щоб видалити товари з кошика.');
      return;
    }
    try {
      await axios.delete(`${baseUrl}/api/cart/${user.id}/${productId}`);
      const updatedCart = await axios.get(`${baseUrl}/api/cart/${user.id}`);
      setCart(updatedCart.data);
    } catch (error) {
      setMessage('Не вдалося видалити товар з кошика.');
    }
  };

  const handleTokenization = async () => {
    if (!stripe || !elements) {
      setMessage('Платіжна система не завантажена.');
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage('Помилка завантаження платіжного поля. Спробуйте ще раз.');
      return;
    }
    
  
    const { token, error } = await stripe.createToken(cardElement);
    if (error) {
      setMessage(`Помилка оплати: ${error.message}`);
      return;
    }
    setStripeToken(token.id);
  };
  
  const handleSubmit = async (data) => {
    if (!user || !cart.length) {
      setMessage('Кошик порожній або користувач не увійшов в систему.');
      navigate('/cart/confirmation-page');
      return;
    }
  
    await handleTokenization();
  
    if (!stripe || !elements) {
      setMessage('Платіжна система ще не завантажена. Спробуйте ще раз пізніше.');
      return;
    }
    
  
    try {
      const response = await axios.post(`${baseUrl}/api/orders`, {
        user_id: user.id,
        cart_items: cart.map(item => ({ product_id: item.id, quantity: 1 })),
        contactEmail: methods.watch('contactEmail'),
        contactName: methods.watch('contactName'),
        contactPhone: methods.watch('contactPhone'),
        shippingAddress: methods.watch('shippingAddress'),
        shippingCity: methods.watch('shippingCity'),
        shippingMethod: methods.watch('shippingMethod'),
        payment_token: stripeToken, 
        payment_method_id: parseInt(methods.watch('paymentMethodId'))
      });
  
      setMessage(response.data.message);
      setCart([]);
      setStep(totalSteps);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Не вдалося оформити замовлення. Спробуйте ще раз.');
    }
  };
  


  

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CartStep cart={cart} removeFromCart={removeFromCart} totalPrice={totalPrice} />;
      case 2:
        return <ContactStep />;
        case 3:
          return <ShippingStep />;
          case 4:
            console.log()
        return <PaymentStep paymentMethods={paymentMethods} onTokenization={handleTokenization}/>;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="checkout-error">
        Будь ласка, увійдіть, щоб продовжити оформлення замовлення. <button onClick={() => window.location.href = '/login'}>Увійти</button>
      </div>
    );
  }
  const isLastStep = step === totalSteps;

  return (
    <FormProvider {...methods}>
      <div className="page">
        <Header />
        <div className="checkout-content">
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
          {message && <p className={message.includes('не вдалося') ? 'error' : 'success'}>{message}</p>}
          {renderStep()}
          <div className="step-buttons">
            {step > 1 && 
              <button onClick={handlePrev} className="prev-button">Назад</button>}
            {isLastStep ? (
              <button onClick={handleSubmit} className="next-button">Оформити замовлення</button>
            ) : (
              <button onClick={handleNext} disabled={isValid} className="next-button"> Далі </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </FormProvider>
  );
}

export default CheckoutPage;
