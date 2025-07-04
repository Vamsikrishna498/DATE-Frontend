 import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrationForm.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
 
// Updated Yup schema for yyyy-MM-dd format
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  dateOfBirth: yup
    .string()
    .required("Date of Birth is required")
    .test("age-range", "Age must be between 18 and 90 years", function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
 
      const ageDifMs = today - dob;
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
 
      return age >= 18 && age <= 90;
    }),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  pinCode: yup
    .string()
    .matches(/^\d{6}$/, "Enter a valid 6-digit Pin Code")
    .required("Pin Code is required"),
  timeZone: yup.string().required("Time Zone is required"),
  email: yup.string()
  .required("Email is required")
  .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email must include '@' and '.' and be valid"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  password: yup.string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/\d/, "Must contain at least one number")
  .matches(/@/, "Must include an '@'"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const selectedState = watch("state");
 
  const [emailValue, setEmailValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
 
  // ✅ Fetch countries
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
 
  // ✅ FIXED: Send OTP
const handleSendOTP = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/send-otp",
      { emailOrPhone: emailValue }, // ✅ send as body
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
 
    alert("OTP sent successfully!");
    setOtpSent(true);
  } catch (error) {
    alert("Error sending OTP.");
    console.error(error);
  }
};
 
 
  // ✅ Handle Verify OTP
const handleVerifyOTP = async () => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/verify-otp", {
      emailOrPhone: emailValue,  // 🔄 corrected key
      otp: otp,
    });
 
    if (response.status === 200) {
      alert("Email verified successfully!");
      setEmailVerified(true);
    } else {
      alert("Invalid OTP.");
    }
  } catch (error) {
    alert("OTP verification error.");
    console.error(error);
  }
};
 
  // ✅ Final Registration Submission
  const onSubmit = async (data) => {
    if (!emailVerified) {
      alert("Please verify your email before submitting.");
      return;
    }
 
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", data);
      alert("Registration successful!");
      reset();
      navigate("/login");
    } catch (error) {
      alert("Registration failed.");
      console.error(error);
    }
  };
 
  return (
    <form
      className="registration-page"
      onSubmit={handleSubmit(onSubmit)}
      style={{ backgroundImage: `url(${background})` }}
    >
      <img src={logo} alt="Logo" className="registration-logo" />
 
      <div className="registration-form-title">
        <h1>Let's get you started</h1>
        <h3>Enter the details to get going</h3>
      </div>
 
      <div className="registration-form-container">
        <h2>Registration Form</h2>
 
        <div className="dateregistration-form">
          <div className="registration-grid">
            <div className="leftform-column">
              <div className="registrationform-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" {...register("firstName")} />
                <p className="reg-error">{errors.firstName?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Date of Birth  <span className="required">*</span></label>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  {...register("dateOfBirth")}
                />
                <p className="reg-error">{errors.dateOfBirth?.message}</p>
              </div>
 
              <div className="registrationform-group">
              <label htmlFor="country-select">Select a country:</label>
<select
                id="country-select"
                {...register("country")}
                value={selectedCountry}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSelectedCountry(selected);
                  setValue("country", selected);
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
                <input type="text" {...register("pinCode")} />
                <p className="reg-error">{errors.pinCode?.message}</p>
              </div>
 
              <div className="registrationform-group">
  <label>Email Address *</label>
  <input
    type="email"
    {...register("email")}
    value={emailValue}
    onChange={(e) => {
      setEmailValue(e.target.value);
      setOtpSent(false);
      setEmailVerified(false);
    }}
  />
  <p className="reg-error">{errors.email?.message}</p>
 
  {!otpSent && (
    <button
      type="button"
      onClick={handleSendOTP}
      className="otp-button"
    >
      Send OTP
    </button>
  )}
 
  {otpSent && !emailVerified && (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button
        type="button"
        onClick={handleVerifyOTP}
        className="otp-verify-button"
      >
        Verify OTP
      </button>
    </div>
  )}
 
  {emailVerified && <p style={{ color: "green" }}>Email Verified ✅</p>}
</div>
 
              <div className="registrationform-group">
                <label>Create Password *</label>
                <input type="password" {...register("password")} />
                <p className="reg-error">{errors.password?.message}</p>
              </div>
            </div>
 
            <div className="rightform-column">
              <div className="registrationform-group">
                <label>Last Name *</label>
                <input type="text" {...register("lastName")} />
                <p className="reg-error">{errors.lastName?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Gender *</label>
                <select {...register("gender")}>
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
    {...register("state")}
    value={selectedState}
    onChange={(e) => setValue("state", e.target.value)}
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
                <label>Time Zone *</label>
                <input type="text" {...register("timeZone")} />
                <p className="reg-error">{errors.timeZone?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Phone Number *</label>
                <input type="text" {...register("phoneNumber")} />
                <p className="reg-error">{errors.phoneNumber?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Confirm Password *</label>
                <input type="password" {...register("confirmPassword")} />
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
      </div>
    </form>
  );
};
 
export default RegistrationForm; 