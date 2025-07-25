import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api/apiService';
import logo from '../assets/rightlogo.png';
import background from '../assets/background-image.png';
import '../styles/Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loginData = { userName, password };
      const response = await api.post('/auth/login', loginData);
      const { token, forcePasswordChange } = response.data;
      localStorage.setItem('token', token); // Save token for API requests
      // If forcePasswordChange is true, redirect to change password page
      if (forcePasswordChange) {
        const user = { userName, role: 'FARMER', forcePasswordChange: true };
        login(user, token);
        navigate('/change-password');
        return;
      }
      try {
        const userResponse = await api.get('/user/profile');
        const userData = userResponse.data;
        const user = {
          userName: userData.userName || userName,
          name: userData.name,
          email: userData.email,
          role: userData.role, // always use backend role
          forcePasswordChange: userData.forcePasswordChange || false,
          status: userData.status
        };
        login(user, token);
        if (user.role === 'SUPER_ADMIN') {
          navigate('/super-admin/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'EMPLOYEE') {
          navigate('/employee/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (profileErr) {
        setError('Failed to fetch user profile. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid credentials or server error.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modern-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="login-background-overlay"></div>
      <div className="login-form-wrapper">
        <div className="login-modern-card">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit} className="login-form-modern">
            <div className="loginform-group">
              <label>Email:</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email or username"
              />
            </div>
            <div className="loginform-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="loginform-links">
           
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;