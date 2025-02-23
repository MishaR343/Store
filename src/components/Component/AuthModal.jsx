import React, { useEffect } from "react";
import PropTypes from "prop-types";
import LoginForm from "../LoginForm";
import RegistrationForm from "../RegistrationForm";
import "../../styles/AuthModal.css";

const AuthModal = ({ isOpen, onClose, authMode, setAuthMode, onAuthSuccess }) => {
  useEffect(() => {
    if (isOpen) {
      // Додати клас для блокування прокрутки
      document.body.classList.add("body-no-scroll");
    } else {
      // Видалити клас при закритті
      document.body.classList.remove("body-no-scroll");
    }

    // Прибираємо клас при демонтажі компонента
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="auth-modal" onClick={handleModalClick}>
        <button className="auth-modal-close" onClick={onClose}>X</button>
        <div className="auth-modal-tabs">
          <button
            className={`auth-tab ${authMode === "login" ? "active" : ""}`}
            onClick={() => setAuthMode("login")}
          >
            Вхід
          </button>
          <button
            className={`auth-tab ${authMode === "register" ? "active" : ""}`}
            onClick={() => setAuthMode("register")}
          >
            Реєстрація
          </button>
        </div>
        <div className="auth-content">
          {authMode === "login" ? (
            <LoginForm onClose={onClose} onLoginSuccess={onAuthSuccess} />
          ) : (
            <RegistrationForm onClose={onClose} onRegisterSuccess={onAuthSuccess} />
          )}
        </div>
      </div>
    </>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  authMode: PropTypes.string.isRequired,
  setAuthMode: PropTypes.func.isRequired,
  onAuthSuccess: PropTypes.func.isRequired,
};

export default AuthModal;
