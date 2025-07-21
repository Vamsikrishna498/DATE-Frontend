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
      const { token } = response.data;
      try {
        const userResponse = await api.get('/user/profile');
        const userData = userResponse.data;
        const user = {
          userName: userData.userName || userName,
          name: userData.name,
          email: userData.email,
          role: userData.role,
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
        const user = {
          userName: userName,
          role: 'FARMER',
          forcePasswordChange: false
        };
        login(user, token);
        navigate('/dashboard');
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
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-content">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form-row">
            <div className="loginform-group">
              <label>Email/Username:</label>
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
            <a href="/forgot-username">Forgot Username?</a>&nbsp;|&nbsp;
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;