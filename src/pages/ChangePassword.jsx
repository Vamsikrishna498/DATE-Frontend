// This page is used for force password change on first login
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api/apiService';
import logo from '../assets/rightlogo.png';
import background from '../assets/background-image.png';
import '../styles/Login.css';

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

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    try {
      await api.post('/auth/reset-password/confirm', {
        emailOrPhone: user?.email || user?.userName,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });
      setSuccess('Password changed successfully! Please log in with your new password.');
      setTimeout(() => {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
  };

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
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-content">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Change Password</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Welcome! Please change your temporary password to continue.
          </p>
          <form onSubmit={handleSubmit} className="login-form-row">
            <div className="loginform-group">
              <label>Current Password (Temporary Password):</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter your temporary password"
              />
            </div>
            <div className="loginform-group">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter your new password"
              />
            </div>
            <div className="loginform-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}
            <button type="submit" className="login-btn">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 