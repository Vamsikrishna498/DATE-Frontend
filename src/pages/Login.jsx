import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authAPI } from '../api/apiService';
import logo from '../assets/rightlogo.png';
import '../styles/Login.css';

const generateClientCaptcha = () => {
  // Fallback client-side captcha generation
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const { login, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('official'); // 'official', 'fpo', 'employee', 'farmer'
  const [captcha, setCaptcha] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load captcha on component mount
  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const response = await authAPI.generateCaptcha();
      setCaptchaValue(response.captcha);
      setCaptcha('');
    } catch (error) {
      console.error('Failed to load captcha from server, using fallback:', error);
      setCaptchaValue(generateClientCaptcha());
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleLoginType = (type) => {
    setLoginType(type);
    setError('');
    setCaptcha('');
    loadCaptcha();
  };

  const handleRefreshCaptcha = () => {
    loadCaptcha();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate captcha
    if (!captcha.trim()) {
      setError('Please enter the captcha.');
      setLoading(false);
      return;
    }

    // Verify captcha with server
    try {
      const captchaVerification = await authAPI.verifyCaptcha(captcha);
      if (!captchaVerification.success) {
        setError('Invalid captcha. Please try again.');
        setLoading(false);
        loadCaptcha();
        return;
      }
    } catch (captchaError) {
      console.error('Captcha verification failed:', captchaError);
      // Fallback to client-side verification if server verification fails
      if (captcha.trim().toLowerCase() !== captchaValue.toLowerCase()) {
        setError('Captcha does not match.');
        setLoading(false);
        loadCaptcha();
        return;
      }
    }
    
    try {
      const loginData = { userName, password };
      console.log('Login - Attempting login with:', { userName, password: '***' });
      
      const response = await authAPI.login(loginData);
      console.log('Login - Full login response:', response);
      
      // Extract data from response
      const { token, user: userData, forcePasswordChange, message } = response;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      console.log('Login - User data from response:', userData);
      console.log('Login - Force password change:', forcePasswordChange);
      
      // Create user object for auth context
      const user = {
        id: userData.id,
        userName: userData.email || userName,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        status: userData.status,
        forcePasswordChange: forcePasswordChange || false
      };
      
      console.log('Login - Final user object:', user);
      console.log('Login - User role:', user.role);
      
      // Store user data and token
      login(user, token);
      
      // Check if user needs to change password
      if (user.forcePasswordChange) {
        console.log('Login - Redirecting to password change');
        navigate('/change-password');
        return;
      }
      
      // Check user status
      if (user.status !== 'APPROVED') {
        setError('Your account is not yet approved by admin.');
        setLoading(false);
        return;
      }
      
      // Role-based navigation
      const normalizedRole = user.role?.toUpperCase?.()?.trim?.() || '';
      console.log('Login - Normalized role for navigation:', normalizedRole);
      
      switch (normalizedRole) {
        case 'SUPER_ADMIN':
          console.log('Login - Redirecting SUPER_ADMIN to /super-admin/dashboard');
          navigate('/super-admin/dashboard');
          break;
        case 'ADMIN':
          console.log('Login - Redirecting ADMIN to /admin/dashboard');
          navigate('/admin/dashboard');
          break;
        case 'EMPLOYEE':
          console.log('Login - Redirecting EMPLOYEE to /employee/dashboard');
          navigate('/employee/dashboard');
          break;
        case 'FARMER':
          console.log('Login - Redirecting FARMER to /dashboard');
          navigate('/dashboard');
          break;
        default:
          console.log('Login - Unknown role, redirecting to login');
          setError('Invalid user role. Please contact administrator.');
          logout();
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error messages from backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    if (loginType === 'employee') {
      navigate('/register-employee', { state: { role: 'EMPLOYEE' } });
    } else if (loginType === 'farmer') {
      navigate('/register-farmer', { state: { role: 'FARMER' } });
    } else if (loginType === 'fpo') {
      navigate('/register-fpo', { state: { role: 'FPO' } });
    }
  };

  return (
    <div className="login-container">
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

        {/* Right Section - Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            {/* DATE Logo at Top */}
            <div className="date-logo-section">
              <img src={logo} alt="DATE Logo" className="date-logo" />
              <div className="date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>
            {/* Login Type Section */}
            <div className="login-type-section">
              <h3>Log In as</h3>
              <div className="login-type-toggle">
                <button 
                  type="button"
                  className={`toggle-btn ${loginType === 'official' ? 'active' : ''}`}
                  onClick={() => handleLoginType('official')}
                >
                  Official
                </button>
                <button 
                  type="button"
                  className={`toggle-btn ${loginType === 'fpo' ? 'active' : ''}`}
                  onClick={() => handleLoginType('fpo')}
                >
                  FPO
                </button>
                <button 
                  type="button"
                  className={`toggle-btn ${loginType === 'employee' ? 'active' : ''}`}
                  onClick={() => handleLoginType('employee')}
                >
                  Employee
                </button>
                <button 
                  type="button"
                  className={`toggle-btn ${loginType === 'farmer' ? 'active' : ''}`}
                  onClick={() => handleLoginType('farmer')}
                >
                  Farmer
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Username Field */}
              <div className="form-field">
                <label>Insert Registered Mobile Number as Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter username"
                />
              </div>

              {/* Password Field */}
              <div className="form-field">
                <label>Enter password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁️
                  </button>
                </div>
              </div>

                             {/* Forgot Password Link */}
               <div className="forgot-password">
                 <a href="/forgot-password">Forgot Password?</a>
                 <span className="separator">|</span>
                 <a href="/forgot-userid">Forgot User ID?</a>
               </div>

              {/* Captcha Section */}
              <div className="captcha-section">
                <label>Captcha</label>
                <div className="captcha-container">
                  <div className="captcha-image">
                    {captchaLoading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>{captchaValue}</span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="refresh-captcha" 
                    onClick={handleRefreshCaptcha}
                    disabled={captchaLoading}
                  >
                    {captchaLoading ? '⏳' : '🔄'}
                  </button>
                  <input
                    type="text"
                    value={captcha}
                    onChange={e => setCaptcha(e.target.value)}
                    placeholder="Enter Captcha"
                    className="captcha-input"
                    disabled={captchaLoading}
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              

              
              <div className="login-actions-row">
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                {(loginType === 'employee' || loginType === 'farmer' || loginType === 'fpo') && (
                  <button
                    type="button"
                    className="create-account-btn"
                    onClick={handleCreateAccount}
                  >
                    Create New user Acount
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 