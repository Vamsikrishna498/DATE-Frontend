import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegistrationForm.css';
import background from '../assets/background-image.png';
import logo from '../assets/rightlogo.png';

//Updated Yup schema for yyyy-MM-dd format
const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  dateOfBirth: yup
    .string()
    .required('Date of Birth is required')
    .test('age-range', 'Age must be between 18 and 90 years', function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();

      const ageDifMs = today - dob;
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      return age >= 18 && age <= 90;
    }),
  gender: yup.string().required('Gender is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  pinCode: yup
    .string()
    .matches(/^\d{6}$/, 'Enter a valid 6-digit Pin Code')
    .required('Pin Code is required'),
  role: yup.string().required('Role is required'),
  email: yup.string()
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must include @ and be valid'),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit phone number')
    .required('Phone number is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/@/, 'Must include an @'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const selectedState = watch('state');

  const [emailValue, setEmailValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(0);

  

 
  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/countries")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);
 
  // ✅ Fetch states by country
  useEffect(() => {
    if (selectedCountry) {
      axios.get(`http://localhost:8080/api/auth/states/${selectedCountry}`)
        .then((res) => setStates(res.data))
        .catch((err) => console.error("Error fetching states:", err));
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (!resendTimer) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!emailValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Enter a valid email first');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/auth/send-otp',
        { emailOrPhone: emailValue },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setOtpSent(true);
      setResendTimer(30);
      alert('OTP sent');
    } catch (e) {
      alert(e.response?.data || 'Failed to send OTP');
      console.error(e);
    }
  };
   
   
    // ✅ Handle Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", {
        emailOrPhone: emailValue,  // 🔄 corrected key
        otp: otp,
      });
      alert("Email verified successfully!");
      setEmailVerified(true);
    } catch (error) {
      alert("OTP verification error.");
      console.error(error);
    }
  };

  // ✅ Final Registration Submission to backend
  const onSubmit = async (data) => {
    if (!emailVerified) {
      alert('Please verify your email before submitting.');
      return;
    }

    try {
      console.log('Submitting registration data:', data);
      const response = await axios.post('/api/auth/register', data);
      console.log('Registration successful:', response.data);
      
      // Show success message with approval notice
      alert('Registration successful! Please wait for admin approval. You will receive an email with login credentials once approved.');
      
      // Reset form
      reset();
      setEmailVerified(false);
      setOtpSent(false);
      setEmailValue('');
      setOtp('');
      
      // Don't navigate to login - user needs to wait for approval
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="reg-modern-registration-container">
      <div className="reg-background-overlay"></div>
      <div className="reg-form-wrapper">
        <div className="reg-modern-form-card">
          <div className="reg-form-logo-info">
            <div className="reg-company-info">
              <h1 className="reg-company-title">Digital Agristack Transaction Enterprises</h1>
              <p className="reg-company-subtitle">Join our agricultural community</p>
            </div>
            <div className="reg-logo-container">
              <img src={logo} alt="DATE Logo" className="reg-form-logo" />
            </div>
          </div>

          <div className="reg-form-header">
            <h2 className="reg-form-title">Registration Form</h2>
            <p className="reg-form-subtitle">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="reg-modern-form">
            {/* Personal Information Section */}
            <div className="reg-form-section">
              <h3 className="reg-section-title">Personal Information</h3>
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label>First Name <span className="reg-required">*</span></label>
                  <input 
                    type="text" 
                    {...register('firstName')} 
                    className={errors.firstName ? 'reg-error' : ''}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="reg-error-message">{errors.firstName.message}</span>}
                </div>

                <div className="reg-form-group">
                  <label>Last Name <span className="reg-required">*</span></label>
                  <input 
                    type="text" 
                    {...register('lastName')} 
                    className={errors.lastName ? 'reg-error' : ''}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="reg-error-message">{errors.lastName.message}</span>}
                </div>
              </div>

              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label>Date of Birth <span className="reg-required">*</span></label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className={errors.dateOfBirth ? 'reg-error' : ''}
                  />
                  {errors.dateOfBirth && <span className="reg-error-message">{errors.dateOfBirth.message}</span>}
                </div>

                <div className="reg-form-group">
                  <label>Gender <span className="reg-required">*</span></label>
                  <select {...register('gender')} className={errors.gender ? 'reg-error' : ''}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="reg-error-message">{errors.gender.message}</span>}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="reg-form-section">
              <h3 className="reg-section-title">Location</h3>
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label>Country <span className="reg-required">*</span></label>
                  <select
                    {...register('country')}
                    value={selectedCountry}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedCountry(selected);
                      setValue('country', selected);
                    }}
                    className={errors.country ? 'reg-error' : ''}
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.iso2}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <span className="reg-error-message">{errors.country.message}</span>}
                </div>

                <div className="reg-form-group">
                  <label>State <span className="reg-required">*</span></label>
                  <select
                    {...register('state')}
                    value={selectedState}
                    onChange={(e) => setValue('state', e.target.value)}
                    className={errors.state ? 'reg-error' : ''}
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <span className="reg-error-message">{errors.state.message}</span>}
                </div>
              </div>

              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label>Pin Code <span className="reg-required">*</span></label>
                  <input 
                    type="text" 
                    {...register('pinCode')} 
                    className={errors.pinCode ? 'reg-error' : ''}
                    placeholder="Enter 6-digit pin code"
                  />
                  {errors.pinCode && <span className="reg-error-message">{errors.pinCode.message}</span>}
                </div>

                <div className="reg-form-group">
                  <label>Role <span className="reg-required">*</span></label>
                  <select {...register("role")} className={errors.role ? 'reg-error' : ''}>
                    <option value="">Select role</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="F.P.O">F.P.O</option>
                    <option value="FARMER">FARMER</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                  </select>
                  {errors.role && <span className="reg-error-message">{errors.role.message}</span>}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="reg-form-section">
              <h3 className="reg-section-title">Contact Information</h3>
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label>Email Address <span className="reg-required">*</span></label>
                  <input
                    type="email"
                    {...register('email')}
                    value={emailValue}
                    onChange={(e) => {
                      setEmailValue(e.target.value);
                      setOtpSent(false);
                      setEmailVerified(false);
                    }}
                    className={errors.email ? 'reg-error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="reg-error-message">{errors.email.message}</span>}
                </div>

                <div className="reg-form-group">
                  <label>Phone Number <span className="reg-required">*</span></label>
                  <input 
                    type="text" 
                    {...register('phoneNumber')} 
                    className={errors.phoneNumber ? 'reg-error' : ''}
                    placeholder="Enter 10-digit number"
                  />
                  {errors.phoneNumber && <span className="reg-error-message">{errors.phoneNumber.message}</span>}
                </div>
              </div>

              {/* Email Verification */}
              <div className="reg-email-verification">
                {(!otpSent && !emailVerified) && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="reg-otp-btn reg-primary"
                  >
                    Send OTP
                  </button>
                )}

                {(otpSent && !emailVerified) && (
                  <div className="reg-otp-container">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="reg-otp-input"
                    />
                    <div className="reg-otp-buttons">
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="reg-otp-btn reg-secondary"
                        disabled={resendTimer > 0}
                      >
                        {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="reg-otp-btn reg-primary"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}

                {emailVerified && (
                  <div className="reg-verification-success">
                    <span className="reg-success-icon">✓</span>
                    Email Verified
                  </div>
                )}
              </div>
            </div>

            {/* Password Section */}
            <div className="reg-form-section">
              <h3 className="reg-section-title">Security</h3>
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label>Create Password <span className="reg-required">*</span></label>
                  <input 
                    type="password" 
                    {...register('password')} 
                    className={errors.password ? 'reg-error' : ''}
                    placeholder="Create a strong password"
                  />
                  {errors.password && <span className="reg-error-message">{errors.password.message}</span>}
                </div>

                <div className="reg-form-group">
                  <label>Confirm Password <span className="reg-required">*</span></label>
                  <input 
                    type="password" 
                    {...register('confirmPassword')} 
                    className={errors.confirmPassword ? 'reg-error' : ''}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <span className="reg-error-message">{errors.confirmPassword.message}</span>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="reg-form-actions">
              <button type="submit" className="reg-submit-btn">
                Create Account
              </button>
            </div>

            {/* Login Link */}
            <div className="reg-login-link">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm; 