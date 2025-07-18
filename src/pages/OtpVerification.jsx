// src/pages/OtpVerification.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
 
import background from '../assets/background-image.png';
import logo       from '../assets/rightlogo.png';
import '../styles/OtpVerification.css';
 
const OtpVerification = () => {
  /* ───────── STATE ───────── */
  const [otp,         setOtp]         = useState('');
  const [timer,       setTimer]       = useState(30);  // 30‑second cooldown
  const [canResend,   setCanResend]   = useState(false);
 
  const navigate  = useNavigate();
  const location  = useLocation();
  const { email, type } = location.state || {};        // { email, type: "userId" | "password" }
 
  /* ───────── GUARD ───────── */
  useEffect(() => {
    if (!email || !type) {
      alert('Invalid navigation – redirecting.');
      navigate('/forgot-password');
    }
  }, [email, type, navigate]);
 
  /* ───────── TIMER ───────── */
  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1_000);
    return () => clearInterval(id);
  }, [timer]);
 
  /* ───────── VERIFY ───────── */
  const handleVerify = async () => {
    if (otp.length !== 6) { alert('Enter a 6‑digit OTP'); return; }
    try {
      await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
      alert('OTP verified ✔️');
      if (type === 'userId') {
        navigate('/change-userid', { state: { email } });
      } else {
        navigate('/change-password', { state: { email } });
      }
    } catch (err) {
      console.error(err);
      alert('Invalid or expired OTP.');
    }
  };
 
  /* ───────── RESEND ───────── */
  const handleResend = async () => {
    if (!canResend) return;
    try {
      await axios.post('http://localhost:8080/api/auth/resend-otp', { email });
      alert('OTP resent!');
      setTimer(30);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      console.error(err);
      alert('Could not resend OTP.');
    }
  };
 
  /* ───────── UI ───────── */
  return (
    <div className="otp-container" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="otp-logo" />
 
      <div className="otp-box">
        <h2>Email Verification</h2>
        <p>We sent a 6‑digit code to <strong>{email}</strong></p>
 
        <label htmlFor="otpInput">Enter OTP</label>
        <input
          id="otpInput"
          className="otp-input"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
        />
 
        <div className="resend-otp">
          {canResend ? (
            <button onClick={handleResend} className="resend-btn">Resend OTP</button>
          ) : (
            <span className="resend-timer">Resend in {timer}s</span>
          )}
        </div>
 
        <div className="otp-buttons">
          <button className="verify-btn" onClick={handleVerify}>Verify</button>
          <button className="back-btn"   onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};
 
export default OtpVerification;
 
 