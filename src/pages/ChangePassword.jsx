// This page is used for force password change on first login
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api/apiService';

const ChangePassword = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    try {
      // Call backend API to change password
      const response = await api.post('/auth/reset-password/confirm', {
        emailOrPhone: user?.email || user?.userName,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });
      setSuccess('Password changed successfully! Please log in with your new password.');
      setTimeout(() => {
        // Log out and redirect to login
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  // If user is not forced to change password, redirect them
  if (!user?.forcePasswordChange) {
    if (user?.role === 'SUPER_ADMIN') {
      navigate('/super-admin/dashboard');
    } else if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'EMPLOYEE') {
      navigate('/employee/dashboard');
    } else {
      navigate('/farmer/dashboard');
    }
    return null;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Change Password</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Welcome! Please change your temporary password to continue.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Current Password (Temporary Password):</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Change Password
        </button>
      </form>
      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default ChangePassword; 