import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Імпортуємо AuthContext
import PropTypes from "prop-types";
import "../styles/LoginForm.css";
import ChangePasswordModal from "./Component/ChangePasswordModal"; // Імпортуємо ChangePasswordModal
import axios from 'axios';

const LoginForm = ({ onClose }) => {
  const { login } = useContext(AuthContext); // Отримуємо функцію login із контексту
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false); // Додали стан для модального вікна

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userData = { email, password };
  
    try {
      const response = await axios.post("http://localhost:5000/api/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
  
      if (data.success) {
        alert("Вхід успішний");
        login(data.user);
        onClose();
      } else {
        setErrorMessage(`Помилка входу: ${data.message}`);
      }
    } catch (error) {
      console.error("Помилка:", error);
      setErrorMessage("Сталася помилка при вході");
    }
  };
  
  const handleOpenModal = () => {
    setModalOpen(true); // Відкриваємо модальне вікно
  };
  
  const handleCloseModal = () => {
    setModalOpen(false); // Закриваємо модальне вікно
  };
  
  return (
    <div className="login-form-container">
      <h2>Вхід</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="login-error-message">{errorMessage}</p>}
        <button type="submit" className="login-submit-button">Увійти</button>
      </form>
      {/* Додаємо посилання "Забули пароль?" */}
      <div className="login-form-footer">
        <p>
          <button onClick={handleOpenModal} className="reset-password-button">
            Забули пароль?
          </button>
        </p>
      </div>
      {isModalOpen && <ChangePasswordModal onClose={handleCloseModal} />} {/* Відображення модального вікна */}
    </div>
  );
};

LoginForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;
