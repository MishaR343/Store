  
  //(Зміна пароля проходить тестування) (Додати перевірку пошти на аутифікацію користувача)

  import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from 'axios';
import "../../styles/ChangePasswordModal.css";

const ChangePasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const passwordData = { email: email, new_password: newPassword };
  
    try {
      const response = await axios.put("http://localhost:5000/api/change-password",
       passwordData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
  
      if (data.success) {
        setSuccessMessage(data.message);
        setErrorMessage("");
      } else {
        setErrorMessage(`Помилка: ${data.message}`);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Помилка:", error);
      setErrorMessage("Сталася помилка при зміні пароля");
    }
  };

  return (
    <>
    <div className="modal-overlay" onClick={onClose} />
    <div className="auth-modal">
    <button className="auth-modal-close" onClick={onClose}>X</button>
      <h2>Змінити пароль</h2>
      <form onSubmit={handleSubmit}>
        <div className="change-password-form-group">
          <label htmlFor="email">Email Користувача:</label>
          <input
            type="text"
            email="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="change-password-form-group">
          <label htmlFor="newPassword">Новий пароль:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="change-password-error-message">{errorMessage}</p>}
        {successMessage && <p className="change-password-success-message">{successMessage}</p>}
        <button type="submit" className="change-password-submit-button">Змінити пароль</button>
      </form>
    </div>
    </>
  );
};

ChangePasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
