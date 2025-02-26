import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../contexts/AuthContext";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";
import WarningModal from "./WarningModal";
import "../../styles/Header.css";

const Header = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleCartClick = (event) => {
    if (!user) {
      event.preventDefault();
      setIsWarningModalOpen(true);
    }
  };

  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  return (
    <header className="header">
      <div className="auth-buttons-container">
        <div className="auth-buttons">
          {user ? (
            <div className="user-info">
              <span>{user.name}</span>
              <button className="auth-button" onClick={handleLogout}>Вийти</button>
            </div>
          ) : (
            <button className="auth-button" onClick={handleOpenAuthModal}>Аутентифікація</button>
          )}
        </div>
      </div>
      <div className="nav-container">
        <ul className="nav-list">
          <li><a href="/" className="nav-item home">Головна</a></li>
          <li>
            <a href="/cart" className="nav-item" onClick={handleCartClick}>Кошик</a>
          </li>
        </ul>
      </div>
      <div className="search-container styled-search">
        <SearchBar onSearch={onSearch} />
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onAuthSuccess={handleCloseAuthModal}
      />
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={handleCloseWarningModal}
      />
    </header>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Header;
