import React from 'react';
import { useFormContext } from 'react-hook-form';

function ContactStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="step-content">
      <h2>Контактна інформація</h2>
      <form>
        <input
          {...register('contactName')}
          placeholder="ім'я та прізвище"
          className="form-input"
        />
        {errors.contactName && <p className="error">{errors.contactName.message}</p>}
        <input
          {...register('contactEmail')}
          type="email"
          placeholder="Email (example@gmail.com)"
          className="form-input"
        />
        {errors.contactEmail && <p className="error">{errors.contactEmail.message}</p>}
        <input
          {...register('contactPhone')}
          placeholder="Телефон (+380 123456789)"
          className="form-input"
        />
        {errors.contactPhone && <p className="error">{errors.contactPhone.message}</p>}
      </form>
    </div>
  );
}

export default ContactStep;