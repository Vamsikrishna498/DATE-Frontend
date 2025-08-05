import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const TokenValidator = () => {
  const { user } = useContext(AuthContext);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateToken = async () => {
    setLoading(true);
    setValidationResult(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setValidationResult({
          valid: false,
          error: 'No token found in localStorage'
        });
        return;
      }

      // Decode token to check expiration
      let tokenPayload;
      try {
        tokenPayload = JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        setValidationResult({
          valid: false,
          error: 'Token is malformed'
        });
        return;
      }

      const isExpired = Date.now() >= tokenPayload.exp * 1000;
      
      if (isExpired) {
        setValidationResult({
          valid: false,
          error: 'Token is expired',
          details: {
            expiresAt: new Date(tokenPayload.exp * 1000).toISOString(),
            currentTime: new Date().toISOString()
          }
        });
        return;
      }

      // Test token with Java backend
      const response = await axios.get('http://localhost:8080/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setValidationResult({
        valid: true,
        message: 'Token is valid',
        details: {
          user: response.data,
          tokenPayload,
          expiresAt: new Date(tokenPayload.exp * 1000).toISOString()
        }
      });

    } catch (error) {
      setValidationResult({
        valid: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const testPasswordChange = async () => {
    setLoading(true);
    setValidationResult(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:8080/api/auth/change-password', {
        currentPassword: 'Employee@123',
        newPassword: 'TestPass@123',
        confirmPassword: 'TestPass@123'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setValidationResult({
        valid: true,
        message: 'Password change test successful',
        details: response.data
      });

    } catch (error) {
      setValidationResult({
        valid: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        details: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔍 Token Validator</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={validateToken}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Validating...' : 'Validate Token'}
        </button>
        
        <button 
          onClick={testPasswordChange}
          disabled={loading}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Password Change'}
        </button>
      </div>

      {validationResult && (
        <div style={{ 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: validationResult.valid ? '#d4edda' : '#f8d7da',
          border: `1px solid ${validationResult.valid ? '#c3e6cb' : '#f5c6cb'}`,
          color: validationResult.valid ? '#155724' : '#721c24'
        }}>
          <h4>{validationResult.valid ? '✅ Success' : '❌ Error'}</h4>
          <p><strong>Message:</strong> {validationResult.message || validationResult.error}</p>
          
          {validationResult.status && (
            <p><strong>Status:</strong> {validationResult.status}</p>
          )}
          
          {validationResult.details && (
            <div>
              <p><strong>Details:</strong></p>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {JSON.stringify(validationResult.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p><strong>Current User:</strong> {user?.userName || 'Not logged in'}</p>
        <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
        <p><strong>Token Exists:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default TokenValidator; 