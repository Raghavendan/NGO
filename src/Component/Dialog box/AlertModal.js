import React from 'react';
import '../Dialog box/AlertModal.css';

function AlertModal({ message, onClose }) {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default AlertModal;
