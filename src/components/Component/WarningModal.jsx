import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/WarningModal.css'; // Додайте стилі для модального вікна

const WarningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="warning-modal">
      <div className="warning-modal-content">
        <h2>Ви ще не авторизовані</h2>
        <p>Авторизуйтеся для користування кошиком.</p>
        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
};

WarningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WarningModal;
