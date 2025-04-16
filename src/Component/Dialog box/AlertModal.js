import React from 'react';
import '../Dialog box/AlertModal.css';

function AlertModal({ message, onConfirm , onCancel }) {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <p>{message}</p>
        <button onClick={onConfirm}>OK</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default AlertModal;
