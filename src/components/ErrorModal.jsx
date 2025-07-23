import React from 'react';
import '../styles/ErrorModal.css';

const ErrorModal = ({ isOpen, error, onClose, onRetry }) => {
  if (!isOpen) return null;

  const getErrorIcon = (status) => {
    switch (status) {
      case 401:
      case 403:
        return '🔐';
      case 404:
        return '🔍';
      case 422:
        return '📝';
      case 500:
        return '⚙️';
      default:
        return '❌';
    }
  };

  const getErrorTitle = (status) => {
    switch (status) {
      case 401:
        return 'Authentication Failed';
      case 403:
        return 'Access Denied';
      case 404:
        return 'Resource Not Found';
      case 422:
        return 'Validation Error';
      case 500:
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  const getErrorDescription = (status) => {
    switch (status) {
      case 401:
        return 'Your session has expired. Please log in again to continue.';
      case 403:
        return 'You don\'t have permission to perform this action. Please log in with appropriate credentials.';
      case 404:
        return 'The requested resource was not found. Please check your request and try again.';
      case 422:
        return 'Please check your form data and ensure all required fields are filled correctly.';
      case 500:
        return 'An unexpected server error occurred. Please try again later or contact support.';
      default:
        return 'An error occurred while processing your request. Please try again.';
    }
  };

  const status = error?.response?.status;
  const icon = getErrorIcon(status);
  const title = getErrorTitle(status);
  const description = getErrorDescription(status);

  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <div className="error-modal-header">
          <span className="error-icon">{icon}</span>
          <h3 className="error-title">{title}</h3>
          <button className="error-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="error-modal-body">
          <p className="error-description">{description}</p>
          
          {error?.response?.data?.message && (
            <div className="error-details">
              <strong>Details:</strong> {error.response.data.message}
            </div>
          )}
        </div>
        
        <div className="error-modal-footer">
          {(status === 401 || status === 403) && (
            <button 
              className="error-btn error-btn-primary" 
              onClick={() => {
                onClose();
                setTimeout(() => {
                  window.location.href = "/login";
                }, 500);
              }}
            >
              Go to Login
            </button>
          )}
          
          {onRetry && status !== 401 && status !== 403 && (
            <button className="error-btn error-btn-secondary" onClick={onRetry}>
              Try Again
            </button>
          )}
          
          <button className="error-btn error-btn-default" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 