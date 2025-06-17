import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import "../styles/Change.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
 
/* ----------------- Validation Schema ----------------- */
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[!@#$%^&*]/, 'Must include a special character (!@#$%^&*)'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});
 
const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  // Retrieve email/phone from either route or sessionStorage
  const routedEmail = location.state?.user;
  const [emailOrPhone, setEmailOrPhone] = useState(
    routedEmail || sessionStorage.getItem('emailOrPhone') || ''
  );
 
  useEffect(() => {
    if (emailOrPhone) {
      sessionStorage.setItem('emailOrPhone', emailOrPhone);
    }
  }, [emailOrPhone]);
 
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });
 
  const onSubmit = async (data) => {
    if (!emailOrPhone) {
      alert('Missing email or phone. Please go through the OTP verification step.');
      return;
    }
 
    const payload = {
      emailOrPhone,
      newPassword: data.password,
      confirmPassword: data.confirmPassword
    };
 
    try {
      setLoading(true);
 
      const response = await fetch('http://34.56.164.208:8080/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to reset password');
      }
 
      alert('Password changed successfully!');
      sessionStorage.removeItem('emailOrPhone');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Failed to change password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="password-container" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="password-logo" />
      <div className="password-box">
        <h2>Password</h2>
        <h4>Set a strong password to prevent unauthorized access to your account.</h4>
 
        <form onSubmit={handleSubmit(onSubmit)} className="change-pass">
          <div className="input-wrapper">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
              />
              <span onClick={() => setShowPassword(!showPassword)}>👁️</span>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
 
          <div className="input-wrapper">
            <label>Confirm New Password</label>
            <div className="password-field">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword')}
              />
              <span onClick={() => setShowConfirm(!showConfirm)}>👁️</span>
            </div>
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>
 
          <button type="submit" className="change-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default ChangePassword; 