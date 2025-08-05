import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
<<<<<<< HEAD
import { authAPI } from '../api/apiService';
import { Link, useLocation } from 'react-router-dom';
import '../styles/RegistrationForm.css';
import logo from '../assets/rightlogo.png';

// Update Yup schema for password validation
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
=======
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegistrationForm.css';
import background from '../assets/background-image.png';
import logo from '../assets/rightlogo.png';

//Updated Yup schema for yyyy-MM-dd format
const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
  dateOfBirth: yup
    .string()
    .required('Date of Birth is required')
    .test('age-range', 'Age must be between 18 and 90 years', function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
<<<<<<< HEAD
      const ageDifMs = today - dob;
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return age >= 18 && age <= 90;
    }),
  gender: yup.string().required('Gender is required'),
=======

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
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
  email: yup.string()
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must include @ and be valid'),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit phone number')
    .required('Phone number is required'),
<<<<<<< HEAD
  role: yup.string().required('Role is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character'),
});

const RegistrationForm = () => {
  const location = useLocation();
  const initialRole = location.state?.role || '';

=======
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
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
  const {
    register,
    handleSubmit,
    reset,
<<<<<<< HEAD
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: initialRole },
  });
=======
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const selectedState = watch('state');
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93

  const [emailValue, setEmailValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
<<<<<<< HEAD
  const [resendTimer, setResendTimer] = useState(0);

=======
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

>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
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
<<<<<<< HEAD
      await authAPI.sendOTP(emailValue);
=======
      await axios.post(
        'http://localhost:8080/api/auth/send-otp',
        { emailOrPhone: emailValue },
        { headers: { 'Content-Type': 'application/json' } }
      );
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
      setOtpSent(true);
      setResendTimer(30);
      alert('OTP sent');
    } catch (e) {
<<<<<<< HEAD
      alert(e.response?.data?.message || 'Failed to send OTP');
=======
      alert(e.response?.data || 'Failed to send OTP');
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
      console.error(e);
    }
  };
   
<<<<<<< HEAD
  // ✅ Handle Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await authAPI.verifyOTP({
        emailOrPhone: emailValue,
=======
   
    // ✅ Handle Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", {
        emailOrPhone: emailValue,  // 🔄 corrected key
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
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
<<<<<<< HEAD
      
      // Format data for register-simple endpoint
      const registrationData = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        role: data.role || 'FARMER' // Default to FARMER if no role specified
      };
      
      console.log('Formatted registration data:', registrationData);
      console.log('Sending to endpoint: /api/auth/register-simple');
      
      const response = await authAPI.registerWithRole(registrationData);
      console.log('Registration successful:', response);
=======
      const response = await axios.post('/api/auth/register', data);
      console.log('Registration successful:', response.data);
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
      
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
<<<<<<< HEAD
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Handle specific error messages from backend
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'Access forbidden. Please check your backend configuration.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
=======
      alert('Registration failed. Please try again.');
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    }
  };

  return (
<<<<<<< HEAD
    <div className="reg-main-content">
      {/* Left Info Panel */}
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
          <p className="help-desk">Empowering Agricultural Excellence</p>
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
      {/* Right Registration Form Card */}
      <div className="reg-form-section">
        <div className="reg-modern-form-card">
          <div className="date-logo-section">
            <img src={logo} alt="DATE Logo" className="date-logo" />
            <div className="date-text">
              <h3>Digital Agristack Transaction Enterprises</h3>
              <p>Empowering Agricultural Excellence</p>
            </div>
          </div>
          <div className="reg-form-header">
            <h2 className="reg-form-title">Registration Form</h2>
            <p className="reg-form-subtitle">Enter your details to get started</p>
          </div>
          <input type="hidden" {...register('role')} value={initialRole} />
            {/* Optionally, show the role as read-only for user confirmation */}
            {initialRole && (
              <div className="reg-form-group">
                <label>Role</label>
                <input type="text" value={initialRole} readOnly className="reg-role-field" />
              </div>
            )}
          <form onSubmit={handleSubmit(onSubmit)} className="reg-modern-form reg-form-grid">

            <div className="reg-form-col">
              <div className="reg-form-group">
                <label> Name <span className="reg-required">*</span></label>
                <input 
                  type="text" 
                  {...register('name')} 
                  className={errors.name ? 'reg-error' : ''}
                  placeholder="Enter your first name"
                />
                {errors.name && <span className="reg-error-message">{errors.name.message}</span>}
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
              <div className="reg-form-group">
                <label>Date of Birth <span className="reg-required">*</span></label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className={errors.dateOfBirth ? 'reg-error' : ''}
                />
                {errors.dateOfBirth && <span className="reg-error-message">{errors.dateOfBirth.message}</span>}
              </div>
            </div>
            <div className="reg-form-col">
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
              <div className="reg-form-group">
                <label>Email Address <span className="reg-required">*</span></label>
=======
    <div className="registration-outer-page" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="registration-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img src={logo} alt="Logo" className="registration-logo" style={{ margin: '0 auto 10px auto', width: '100px', display: 'block' }} />
        <h1 style={{ fontWeight: 700, fontSize: '2.1rem', margin: 0 }}>Lets get you started</h1>
        <h3 style={{ fontWeight: 500, fontSize: '1.1rem', margin: 0 }}>Enter the details to get going</h3>
      </div>
      <form
        className="registration-form-container luxury-card"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>Registration Form</h2>
        <div className="dateregistration-form">
          <div className="registration-grid">
            <div className="leftform-column">
              <div className="registrationform-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" {...register('firstName')} />
                <p className="reg-error">{errors.firstName?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Date of Birth  <span className="required">*</span></label>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  {...register('dateOfBirth')}
                />
                <p className="reg-error">{errors.dateOfBirth?.message}</p>
              </div>

              <div className="registrationform-group">
                <label htmlFor="country-select">Select a country:</label>
                <select
                  id="country-select"
                  {...register('country')}
                  value={selectedCountry}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedCountry(selected);
                    setValue('country', selected);
                  }}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <p className="reg-error">{errors.country?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Pin Code *</label>
                <input type="text" {...register('pinCode')} />
                <p className="reg-error">{errors.pinCode?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Email Address *</label>
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
                <input
                  type="email"
                  {...register('email')}
                  value={emailValue}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                    setOtpSent(false);
                    setEmailVerified(false);
                  }}
<<<<<<< HEAD
                  className={errors.email ? 'reg-error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="reg-error-message">{errors.email.message}</span>}
               
              </div>
              <div className="reg-form-group">
                <label>Password <span className="reg-required">*</span></label>
                <input
                  type="password"
                  {...register('password')}
                  className={errors.password ? 'reg-error' : ''}
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                />
                {errors.password && <span className="reg-error-message">{errors.password.message}</span>}

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
            <div className="reg-form-actions reg-form-actions-full">
              <button type="submit" className="reg-submit-btn">
                Register Now ...
              </button>
            </div>
            <div className="reg-login-link reg-form-actions-full">
              <h4>Already have an account? <Link to="/login">Sign In</Link></h4>
            </div>
          </form>
        </div>
      </div>
=======
                />
                <p className="reg-error">{errors.email?.message}</p>

                {/* Show Send OTP before first OTP is sent */}
                {(!otpSent && !emailVerified) && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="otp-button"
                  >
                    Send OTP
                  </button>
                )}

                {/* After OTP is sent and not yet verified, show OTP input and Resend OTP button side by side */}
                {(otpSent && !emailVerified) && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="otp-button"
                        disabled={resendTimer > 0}
                        style={{ minWidth: '120px' }}
                      >
                        {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="otp-verify-button"
                        style={{ minWidth: '90px' }}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                )}

                {emailVerified && <p style={{ color: 'green' }}>Email Verified ✅</p>}
              </div>

              <div className="registrationform-group">
                <label>Create Password *</label>
                <input type="password" {...register('password')} />
                <p className="reg-error">{errors.password?.message}</p>
              </div>
            </div>

            <div className="rightform-column">
              <div className="registrationform-group">
                <label>Last Name *</label>
                <input type="text" {...register('lastName')} />
                <p className="reg-error">{errors.lastName?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Gender *</label>
                <select {...register('gender')}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="reg-error">{errors.gender?.message}</p>
              </div>

              <div className="registrationform-group">
                <label htmlFor="state-select">Select a state:</label>
                <select
                  id="state-select"
                  {...register('state')}
                  value={selectedState}
                  onChange={(e) => setValue('state', e.target.value)}
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <p className="reg-error">{errors.state?.message}</p>
              </div>

              <div className="registrationform-group">
              <label>Role *</label>
<select {...register("role")} defaultValue="">
<option value="" disabled>Select role</option>
<option value="ADMIN">ADMIN</option>
<option value="F.P.O">F.P.O</option>
<option value="FARMER">FARMER</option>
<option value="EMPLOYEE">EMPLOYEE</option>
</select>
<p className="reg-error">{errors.role?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Phone Number *</label>
                <input type="text" {...register('phoneNumber')} />
                <p className="reg-error">{errors.phoneNumber?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Confirm Password *</label>
                <input type="password" {...register('confirmPassword')} />
                <p className="reg-error">{errors.confirmPassword?.message}</p>
              </div>
        </div>
        </div>
        </div>

        <button type="submit" className="registersubmit-btn">
          Register Now
        </button>

        <div className="login-link">
          <h3>Already a member? <Link to="/login">Login</Link></h3>
        </div>
    </form>
>>>>>>> 428471ae12e0afc11adec9a845289f54a9875c93
    </div>
  );
};

export default RegistrationForm; 