import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/RegistrationForm.css';
import axios from 'axios';

const RegistrationForm = ({ onClose, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');  // Додано для телефону
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('Паролі не співпадають');
      return;
    }
  
    const userData = {
      username,
      email,
      password,
      phone,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
  
      if (data.success) {
        alert('Реєстрація пройшла успішно');
        onRegisterSuccess(); // Відкриваємо вікно входу після успішної реєстрації
        onClose(); // Закриваємо модальне вікно реєстрації
      } else {
        setErrorMessage(`Помилка реєстрації: ${data.message}`);
      }
    } catch (error) {
      console.error('Помилка:', error);
      setErrorMessage('Сталася помилка при реєстрації');
    }
  };
  
  return (
    <div className="registration-form-container">
    <h2>Реєстрація</h2>
    <form onSubmit={handleSubmit}>
      <div className="registration-form-group">
        <label htmlFor="username">Ім`я користувача:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="registration-form-group">
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="registration-form-group">
        <label htmlFor="phone">Телефон (необов`язково):</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="registration-form-group">
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="registration-form-group">
        <label htmlFor="confirmPassword">Підтвердьте пароль:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && <p className="registration-error-message">{errorMessage}</p>}
      <button type="submit" className="registration-submit-button">Зареєструватися</button>
    </form>
  </div>  
  );
};

// Добавляємо валідацію пропсів
RegistrationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRegisterSuccess: PropTypes.func.isRequired
};

export default RegistrationForm;
