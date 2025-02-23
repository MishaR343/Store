import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

function PaymentStep({ paymentMethods }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-content">
      <h2>Інформація про оплату</h2>
      <form>
        <input
          {...register('cardNumber', {
            required: 'Номер картки є обов’язковим',
            pattern: {
              value: /^[0-9]{16}$/,
              message: 'Номер картки повинен містити 16 цифр',
            },
          })}
          placeholder="Номер картки (16 цифр)"
          className={`form-input ${errors.cardNumber ? 'input-error' : ''}`}
        />
        {errors.cardNumber && <p className="error">{errors.cardNumber.message}</p>}

        <input
          {...register('cardExpiry', {
            required: 'Дата закінчення є обов’язковою',
            pattern: {
              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: 'Формат має бути MM/YY',
            },
          })}
          placeholder="Термін дії (MM/YY)"
          className={`form-input ${errors.cardExpiry ? 'input-error' : ''}`}
        />
        {errors.cardExpiry && <p className="error">{errors.cardExpiry.message}</p>}

        <input
          {...register('cardCvv', {
            required: 'CVV є обов’язковим',
            pattern: {
              value: /^[0-9]{3,4}$/,
              message: 'CVV повинен містити 3-4 цифри',
            },
          })}
          placeholder="CVV (3-4 цифри)"
          className={`form-input ${errors.cardCvv ? 'input-error' : ''}`}
        />
        {errors.cardCvv && <p className="error">{errors.cardCvv.message}</p>}

        <select
          {...register('paymentMethodId', { required: 'Будь ласка, виберіть спосіб оплати' })}
          className={`form-input ${errors.paymentMethodId ? 'input-error' : ''}`}
        >
          <option value="">Оберіть спосіб оплати</option>
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
        {errors.paymentMethodId && <p className="error">{errors.paymentMethodId.message}</p>}
      </form>
    </div>
  );
}

// Перевірка пропсів
PaymentStep.propTypes = {
  paymentMethods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PaymentStep;