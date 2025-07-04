import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import "../styles/OtpVerification.css";
 
const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
 
  const { target, type } = location.state || {}; // Expecting { target, type }
 
  useEffect(() => {
    if (!target || !type) {
      alert("Invalid navigation. Redirecting to Forgot page.");
      navigate('/forgot-password');
    }
  }, [target, type, navigate]);
 
  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
 
    try {
      // Always verify OTP first
      const res = await axios.post('http://localhost:8080/api/auth/verify-otp', {
        emailOrPhone: target,
        otp: otp
      });
 
      alert(res.data || "OTP Verified Successfully");
 
      if (type === 'userId') {
        navigate('/change-userid', { state: { user: target } });
      } else if (type === 'password') {
        navigate('/change-password', { state: { user: target, otp } }); // Pass OTP along for confirm
      }
    } catch (error) {
      console.error(error);
      alert("Invalid or expired OTP. Please try again.");
    }
  };
 
  const handleResend = async () => {
    try {
      const resendUrl = type === 'userId'
        ? 'http://localhost:8080/api/auth/send-otp' // Adjust if separate endpoint exists
        : 'http://localhost:8080/api/auth/forgot-password';
 
      await axios.post(resendUrl, {
        emailOrPhone: target
      });
 
      alert("OTP resent to your email.");
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP.");
    }
  };
 
  return (
    <div className="otp-container" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="otp-logo" />
      <div className="otp-box">
        <h2>Verify Email Address</h2>
        <p><strong>OTP has been sent to {target || 'your email'}</strong></p>
 
        <label htmlFor="otpInput">Enter OTP</label>
        <input
          id="otpInput"
          type="password"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
        />
 
        <span className="resend-otp" onClick={handleResend}>Resend OTP</span>
 
        <div className="otp-buttons">
          <button onClick={handleVerify} className="verify-btn">Verify</button>
          <button onClick={() => navigate(-1)} className="back-btn">Back</button>
        </div>
      </div>
    </div>
  );
};
 
export default OtpVerification;