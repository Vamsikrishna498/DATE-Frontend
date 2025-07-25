import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import illustration from "../assets/illustration1.png";
import "../styles/ForgotPassword.css";
 
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
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
 
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState("");
 
   const navigate = useNavigate();
   const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        emailOrPhone: data.userInput
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
 
      setTarget(data.userInput);
      setShowPopup(true); // Show popup on success
    } catch (error) {
      console.error("Error sending reset request:", error);
      alert("Failed to send reset link. Please try again.");
    }
  };
 
     const handlePopupClose = () => {
  setShowPopup(false);
  navigate('/otp-verification', { state: { target, type: 'password' } });
};
 
 
 
 
  return (
    <div className="login-modern-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="login-background-overlay"></div>
      <div className="login-form-wrapper">
        <div className="login-modern-card">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-title">Forgot Password</h2>
          <p>Enter your email address, click "Reset password", and we’ll send you a link to reset your password.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form-modern">
            <div className="loginform-group">
              <label>Email<span className="reg-required">*</span></label>
              <input
                {...register("userInput")}
                placeholder="Enter your Email"
                className={errors.userInput ? 'reg-error' : ''}
              />
              {errors.userInput && <span className="login-error">{errors.userInput.message}</span>}
            </div>
            <button type="submit" className="login-btn">Reset password</button>
          </form>
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
  );
};
 
export default ForgotPassword;