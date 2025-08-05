import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
<<<<<<< HEAD
import { authAPI } from "../api/apiService";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
=======
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import illustration from "../assets/illustration1.png";
import "../styles/ForgotPassword.css";
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
 
// ✅ Schema validation
const schema = Yup.object().shape({
  userInput: Yup.string()
    .required("Email / Phone / ID is required")
    .test(
      "valid-userInput",
      "Enter a valid Email (with '@' and '.'), 10-digit Phone number, or ID (min 6 characters)",
      function (value) {
        if (!value) return false;
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
 
        const isEmail = emailRegex.test(value);
        const isPhone = phoneRegex.test(value);
        const isId = !isEmail && !isPhone && value.length >= 6;
 
        return isEmail || isPhone || isId;
      }
    ),
});
 
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
<<<<<<< HEAD
=======
    reset,
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
 
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState("");
 
   const navigate = useNavigate();
   const onSubmit = async (data) => {
    try {
<<<<<<< HEAD
      console.log('Sending forgot password request for:', data.userInput);
      const response = await authAPI.forgotPassword(data.userInput);
      console.log('Forgot password response:', response);

=======
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        emailOrPhone: data.userInput
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
 
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
      setTarget(data.userInput);
      setShowPopup(true); // Show popup on success
    } catch (error) {
      console.error("Error sending reset request:", error);
<<<<<<< HEAD
      
      // Handle specific error messages from backend
      let errorMessage = "Failed to send reset link. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
=======
      alert("Failed to send reset link. Please try again.");
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    }
  };
 
     const handlePopupClose = () => {
  setShowPopup(false);
  navigate('/otp-verification', { state: { target, type: 'password' } });
};
 
<<<<<<< HEAD
  return (
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

        {/* Right Section - Forgot Password Form */}
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

            <div className="forgot-password-content">
              <h2>Forgot Password</h2>
              <p>Enter your email address, click "Reset password", and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-field">
                  <label>Email<span className="required">*</span></label>
                  <input
                    {...register("userInput")}
                    placeholder="Enter your Email"
                    className={errors.userInput ? 'error' : ''}
                  />
                  {errors.userInput && <div className="error">{errors.userInput.message}</div>}
                </div>
                <button type="submit" className="login-btn">Reset password</button>
              </form>
            </div>

            {/* Success Popup */}
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h3>Success!</h3>
                  <h4>
                    A reset link has been sent to <strong>{target}</strong>
                  </h4>
                  <button onClick={handlePopupClose}>OK</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
=======
 
 
 
  return (
    <div className="ForgotPassword-page" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="ForgotPassword-logo" />
 
      <div className="ForgotPassword-container">
        <h2>Forgot Password</h2>
        <p>
          Enter your email address, click “Reset password”, and we’ll send you a link to reset your password.
        </p>
 
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email<span className="required">*</span>
          </label>
          <input
            {...register("userInput")}
            placeholder="Enter your Email"
          />
          {errors.userInput && <p className="error">{errors.userInput.message}</p>}
 
          <button type="submit">Reset password</button>
        </form>
      </div>
 
      <div className="ForgotPassword-image">
        <img src={illustration} alt="Illustration" />
      </div>
 
      {/* ✅ Success Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Success!</h3>
            <h4>
              A reset link has been sent to <strong>{target}</strong>
            </h4>
            <button onClick={handlePopupClose}>OK</button>
          </div>
        </div>
      )}
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    </div>
  );
};
 
<<<<<<< HEAD
export default ForgotPassword; 
=======
export default ForgotPassword;
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
