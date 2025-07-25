import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../styles/ForgotUser.css";
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
       await axios.post("http://localhost:8080/api/auth/forgot-user-id", {
        emailOrPhone: data.userInput,
      }, {
        headers: { "Content-Type": "application/json" },
      });
 
      setTarget(data.userInput);
      setShowPopup(true); // Show success popup
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send User ID. Please try again later.");
    }
  };
 
  const handlePopupClose = () => {
  setShowPopup(false);
  navigate('/otp-verification', { state: { target, type: 'userId' } });
};
 
  return (
    <div className="login-modern-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="login-background-overlay"></div>
      <div className="login-form-wrapper">
        <div className="login-modern-card">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-title">Forgot User ID</h2>
          <p>Enter your Email / Phone / ID, click "Reset User ID", and we’ll send your User ID if it exists.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form-modern">
            <div className="loginform-group">
              <label>Email / Phone / ID <span className="reg-required">*</span></label>
              <input
                {...register("userInput")}
                placeholder="Enter your Email or Phone or ID"
                className={errors.userInput ? 'reg-error' : ''}
              />
              {errors.userInput && <span className="login-error">{errors.userInput.message}</span>}
            </div>
            <button type="submit" className="login-btn">Reset User ID</button>
          </form>
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
  );
};
 
export default ForgotUserId;