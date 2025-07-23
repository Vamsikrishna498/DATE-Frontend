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

  if (!user) {
    navigate('/login');
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
          <form onSubmit={handleSubmit} className="login-form-row">
            <div className="loginform-group">
              <label>Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter your current password"
                disabled={!!success}
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
                disabled={!!success}
              />
              <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                Password must be at least 6 characters, include an uppercase letter, a number, and an @ symbol.
              </div>
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
                disabled={!!success}
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}
            <button type="submit" className="login-btn" disabled={!!success}>
              Change Password
            </button>
          </form>
          {/* Success popup/modal */}
          {success && (
            <div style={{
              position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
                <h2 style={{ color: '#22c55e', marginBottom: 12 }}>Password Changed!</h2>
                <p style={{ color: '#333', marginBottom: 18 }}>Your password has been updated.<br/>Please log in with your new password.</p>
                <button className="login-btn" onClick={() => { window.localStorage.removeItem('user'); window.localStorage.removeItem('token'); navigate('/login'); }}>
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 