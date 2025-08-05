// This page is used for force password change on first login
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authAPI } from '../api/apiService';
import axios from 'axios';
import TokenValidator from '../components/TokenValidator';
import logo from '../assets/rightlogo.png';
import background from '../assets/background-image.png';
import '../styles/Login.css';

const ChangePassword = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [useAlternativeEndpoint, setUseAlternativeEndpoint] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugInfo('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
<<<<<<< HEAD
    
    // Check password requirements
    const hasUpperCase = /[A-Z]/.test(form.newPassword);
    const hasNumber = /\d/.test(form.newPassword);
    const hasAtSymbol = /@/.test(form.newPassword);
    
    if (!hasUpperCase || !hasNumber || !hasAtSymbol) {
      setError('Password must include an uppercase letter, a number, and an @ symbol.');
      return;
    }

    // Check if backend server is running
    try {
      await axios.get('http://localhost:8080/api/test');
    } catch (error) {
      console.log('Backend test failed, but continuing with password change...');
      // Don't block the password change attempt
    }

    try {
      // Debug: Check authentication state
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('🔍 DEBUG INFO:');
      console.log('User from context:', user);
      console.log('Token exists:', !!token);
      console.log('User data exists:', !!userData);
      console.log('Using alternative endpoint:', useAlternativeEndpoint);
      
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          console.log('Token expires at:', new Date(tokenPayload.exp * 1000));
          console.log('Current time:', new Date());
          console.log('Token is expired:', Date.now() >= tokenPayload.exp * 1000);
        } catch (tokenError) {
          console.log('Token parsing error:', tokenError);
        }
      }

      setDebugInfo(`Debug: User ID: ${user?.id}, Token: ${token ? 'Present' : 'Missing'}, Endpoint: ${useAlternativeEndpoint ? 'Alternative' : 'Original'}`);
      
      console.log('Attempting to change password for user:', user?.email || user?.userName);
      console.log('Request payload:', {
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });
      
      let response;
      
             if (useAlternativeEndpoint) {
         // Use the alternative reset-password endpoint
         console.log('🔄 Using alternative endpoint: /api/auth/reset-password/confirm');
         response = await axios.post('http://localhost:8080/api/auth/reset-password/confirm', {
           newPassword: form.newPassword,
           confirmPassword: form.confirmPassword
         }, {
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         });
               } else {
          // Use the Java backend change-password endpoint
          console.log('🔄 Using Java backend endpoint: /api/auth/change-password');
          response = await axios.post('http://localhost:8080/api/auth/change-password', {
            currentPassword: 'Employee@123', // Default password for force change
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      
      console.log('Password change response:', response);
      
      setSuccess('Password changed successfully! Redirecting to dashboard...');
      
      // Update user data with the response from server
      const updatedUser = response.data?.user || response.user || {
        ...user,
        forcePasswordChange: false
      };
      
      // Update localStorage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser, localStorage.getItem('token'));
      
      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        if (user.role === 'SUPER_ADMIN') {
          navigate('/super-admin/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'EMPLOYEE') {
          navigate('/employee/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      console.error('❌ Password change error:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error headers:', err.response?.headers);
      
      // Provide more specific error messages
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid password format. Please check the requirements.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError(`Access denied (403). Token: ${localStorage.getItem('token') ? 'Present' : 'Missing'}. Please check your credentials or contact administrator.`);
      } else if (err.response?.status === 404) {
        setError('User not found. Please contact administrator.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to change password. Please try again.');
      }
=======
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
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
<<<<<<< HEAD
    <div className="kerala-login-container">
      {/* Top Navigation Bar */}
      <nav className="nic-navbar">
        <div className="nic-logo">
          <span>DATE</span>
        </div>
        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
          <span className="nav-dot">•</span>
          <a href="#csc">Login with CSC</a>
        </div>
      </nav>

      <div className="main-content">
        {/* Left Section - Information Panel */}
        <div className="info-panel">
          <div className="agri-stack-header">
            <h1 className="agri-stack-title">
              <span className="agri-text">Date</span>
              <span className="agri-text">Agri</span>
              <span className="leaf-icon">🌿</span>
              <span className="stack-text">Stack</span>
            </h1>
            <h2 className="registry-title">India Farmer Registry</h2>
          </div>
          <div className="registry-info">
            <h3>Digital Agristack Transaction Enterprises</h3>
            <p className="help-desk">
              Empowering Agricultural Excellence
            </p>
          </div>
          
          {/* Enhanced Agricultural Content */}
          <div className="agricultural-highlights">
            <div className="highlight-item">
              <span className="highlight-icon">🌾</span>
              <div className="highlight-content">
                <h4>Revolutionizing Indian Agriculture</h4>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <span className="highlight-icon">📱</span>
              <div className="highlight-content">
                <h4>Smart Farming Technology</h4>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <span className="highlight-icon">💰</span>
              <div className="highlight-content">
                <h4>Financial Inclusion</h4>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <span className="highlight-icon">🌱</span>
              <div className="highlight-content">
                <h4>Sustainable Practices</h4>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>
            
            <div className="highlight-item">
              <span className="highlight-icon">🏆</span>
              <div className="highlight-content">
                <h4>National Recognition</h4>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Change Password Form */}
        <div className="login-form-section">
          <div className="login-card">
            {/* DATE Logo at Top */}
            <div className="date-logo-section">
              <div className="date-logo">DATE</div>
              <div className="date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="change-password-content">
              <h2>Change Password</h2>
              
                             {/* Debug Token Validator */}
               <TokenValidator />
               
               {/* Quick Fix Buttons */}
               <div style={{ 
                 background: '#fff3cd', 
                 padding: '15px', 
                 marginBottom: '15px', 
                 borderRadius: '4px',
                 border: '1px solid #ffeaa7'
               }}>
                 <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔧 Quick Fixes</h4>
                 <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                   <button 
                     onClick={() => {
                       localStorage.removeItem('token');
                       localStorage.removeItem('user');
                       window.location.href = '/login';
                     }}
                     style={{ 
                       padding: '8px 16px',
                       backgroundColor: '#dc3545',
                       color: 'white',
                       border: 'none',
                       borderRadius: '4px',
                       cursor: 'pointer',
                       fontSize: '12px'
                     }}
                   >
                     🔄 Refresh Token (Logout & Login)
                   </button>
                                       <button 
                      onClick={() => {
                        // Test Java backend connection
                        window.open('http://localhost:8080/api/auth/login', '_blank');
                      }}
                      style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🔍 Test Java Backend
                    </button>
                 </div>
                                   <div style={{ fontSize: '12px', color: '#856404', marginTop: '8px' }}>
                    If you're getting 403 errors, try refreshing your token or check if the backend is running.
                    <br />
                                         <strong>Note:</strong> Your Java backend is running. Make sure the token is valid.
                  </div>
               </div>
              
              {/* Endpoint Toggle */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '10px', 
                marginBottom: '15px', 
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={useAlternativeEndpoint}
                    onChange={(e) => setUseAlternativeEndpoint(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  Use Alternative Endpoint (reset-password/confirm)
                </label>
                                 <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                   {useAlternativeEndpoint ? 'Using: /api/auth/reset-password/confirm' : 'Using: /api/auth/change-password (Java Backend)'}
                 </div>
              </div>
              
              {debugInfo && (
                <div style={{ 
                  background: '#f0f0f0', 
                  padding: '10px', 
                  marginBottom: '15px', 
                  fontSize: '12px', 
                  color: '#666',
                  borderRadius: '4px'
                }}>
                  {debugInfo}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-field">
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
                <div className="form-field">
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
                {error && <div className="error-text">{error}</div>}
                {success && <div className="success-text">{success}</div>}
                <button type="submit" className="login-btn" disabled={!!success}>
                  Change Password
                </button>
              </form>
            </div>

            {/* Success popup/modal */}
            {success && (
              <div style={{
                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
                  <h2 style={{ color: '#22c55e', marginBottom: 12 }}>Password Changed!</h2>
                  <p style={{ color: '#333', marginBottom: 18 }}>Your password has been updated successfully.<br/>Redirecting to your dashboard...</p>
                </div>
              </div>
            )}
          </div>
=======
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
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 