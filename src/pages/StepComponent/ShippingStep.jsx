import React from 'react';
import { useFormContext } from 'react-hook-form';

function ShippingStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="step-content">
      <h2>Інформація про доставку</h2>
      <form>
        <input
          {...register('shippingAddress')}
          placeholder="Адреса"
          className="form-input"
        />
        {errors.shippingAddress && <p className="error">{errors.shippingAddress.message}</p>}
        <input
          {...register('shippingCity')}
          placeholder="Місто"
          className="form-input"
        />
        {errors.shippingCity && <p className="error">{errors.shippingCity.message}</p>}
        <select {...register('shippingMethod')} className="form-input">
          <option value="">Оберіть спосіб доставки</option>
          <option value="courier">Кур`єр</option>
          <option value="post">Пошта</option>
          <option value="pickup">Самовивіз</option>
        </select>
        {errors.shippingMethod && <p className="error">{errors.shippingMethod.message}</p>}
      </form>
    </div>
  );
}

export default ShippingStep;
