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
import "../styles/ForgotUser.css";
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import illustration1 from "../assets/illustration1.png";
 
// ✅ Validation schema
const schema = Yup.object().shape({
  userInput: Yup.string()
    .required("Email / Phone / ID is required")
    .test(
      "is-valid",
      "Enter a valid Email (with '@' and '.'), 10-digit Phone number, or ID (min 6 characters)",
      (value = "") => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        return (
          emailRegex.test(value) ||
          phoneRegex.test(value) ||
          (value.length >= 6 && !emailRegex.test(value) && !phoneRegex.test(value))
        );
      }
    ),
});
 
const ForgotUserId = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
 
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState("");
  const navigate = useNavigate();
 
   const onSubmit = async (data) => {
    try {
<<<<<<< HEAD
      console.log('Sending forgot user ID request for:', data.userInput);
      const response = await authAPI.forgotUserId(data.userInput);
      console.log('Forgot user ID response:', response);

=======
       await axios.post("http://localhost:8080/api/auth/forgot-user-id", {
        emailOrPhone: data.userInput,
      }, {
        headers: { "Content-Type": "application/json" },
      });
 
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
      setTarget(data.userInput);
      setShowPopup(true); // Show success popup
    } catch (error) {
      console.error("Error:", error);
<<<<<<< HEAD
      
      // Handle specific error messages from backend
      let errorMessage = "Failed to send User ID. Please try again later.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
=======
      alert("Failed to send User ID. Please try again later.");
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    }
  };
 
  const handlePopupClose = () => {
  setShowPopup(false);
  navigate('/otp-verification', { state: { target, type: 'userId' } });
};
 
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

        {/* Right Section - Forgot User ID Form */}
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

            <div className="forgot-userid-content">
              <h2>Forgot User ID</h2>
              <p>Enter your Email / Phone / ID, click "Reset User ID", and we'll send your User ID if it exists.</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-field">
                  <label>Email / Phone / ID <span className="required">*</span></label>
                  <input
                    {...register("userInput")}
                    placeholder="Enter your Email or Phone or ID"
                    className={errors.userInput ? 'error' : ''}
                  />
                  {errors.userInput && <div className="error">{errors.userInput.message}</div>}
                </div>
                <button type="submit" className="login-btn">Reset User ID</button>
              </form>
            </div>

            {/* Success Popup */}
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h3>Success!</h3>
                  <h4>
                    Your User ID has been sent to <strong>{target}</strong>
                  </h4>
                  <button onClick={handlePopupClose}>OK</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
=======
    <div
      className="ForgotUserId-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <img src={logo} alt="Logo" className="ForgotUserId-logo" />
 
      <div className="ForgotUserId-left">
        <h2 className="text-2xl font-bold mb-4">Forgot User ID</h2>
        <p className="mb-6">
          Enter your Email / Phone / ID, click “Reset User ID”, and we’ll send your User ID if it exists.
        </p>
 
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block mb-1 font-medium">
            Email / Phone / ID <span className="text-red-600">*</span>
          </label>
          <input
            {...register("userInput")}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter your Email or Phone or ID"
          />
          {errors.userInput && (
            <p className="text-red-600 text-sm mb-4">{errors.userInput.message}</p>
          )}
 
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Reset User ID
          </button>
        </form>
      </div>
 
      <div className="ForgotUser-image">
        <img src={illustration1} alt="Forgot User Illustration" />
      </div>
 
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3 className="text-lg font-bold mb-2">Success!</h3>
            <p className="mb-4">
              Your User ID has been sent to <strong>{target}</strong>
            </p>
            <button
              onClick={handlePopupClose}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    </div>
  );
};
 
<<<<<<< HEAD
export default ForgotUserId; 
=======
export default ForgotUserId;
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
