import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  // Map icons according to toast types
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" size={18} />;
      case 'error':
        return <AlertCircle className="toast-icon" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon" size={18} />;
      case 'info':
      default:
        return <Info className="toast-icon" size={18} />;
    }
  };

  return (
    <div className={`toast glass-panel ${type} animate-fade-in`}>
      <span className="toast-icon-container">
        {getIcon()}
      </span>
      <p className="toast-message">{message}</p>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss Alert">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
