import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { parse, isValid, differenceInYears } from "date-fns";
import * as yup from "yup";
import axios from "axios";
import { registerUser, loginUser, getUserProfile } from "../api/apiService";
import { Link } from "react-router-dom";
import "../styles/RegistrationForm.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  dateofBirth: yup.string().required("Date of Birth is required")
        .test("valid-format", "Enter date as DD/MM/YYYY", (value) => {
          const parsed = parse(value, "dd/MM/yyyy", new Date());
          return isValid(parsed);
        })
        .test("age-limit", "Age must be between 18 and 90 years", (value) => {
          const parsed = parse(value, "dd/MM/yyyy", new Date());
          if (!isValid(parsed)) return false;
          const age = differenceInYears(new Date(), parsed);
          return age >= 18 && age <= 90;
        }),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  pinCode: yup.string().matches(/^\d{6}$/, "Enter a valid 6-digit Pin Code").required("Pin Code is required"),
  timeZone: yup.string().required("Time Zone is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phoneNumber: yup.string().matches(/^\d{10}$/, "Enter a valid 10-digit phone number").required("Phone number is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm Password is required"),
});

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);

      if (response.status === 201 || response.status === 200) {
        alert("🎉 Registration successful!");
        setShowSuccessPopup(true); 
        reset(); // Clear the form
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      setShowSuccessPopup(true); 
    }
  };
  

  
  return (
    <form className="registration-page" onSubmit={handleSubmit(onSubmit)} style={{ backgroundImage: `url(${background})` }}>
      
      <img src={logo} alt="Logo" className="registration-logo" />

      <div className="registration-form-title">
        <h1>Let's get you started</h1>
        <h3>Enter the details to get going</h3>
        </div>
      <div className="registration-form-container">
        <h2>Registration Form</h2>

        <div className="registration-form" onSubmit={handleSubmit(onSubmit)}> 
          <div className="registration-grid">
            <div className="form-column">
              <div className="registrationform-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" {...register("firstName")} />
                <p className="error">{errors.firstName?.message}</p>
              </div>

              <div className="registrationform-group">
              <label>Date of Birth (DD/MM/YYYY) <span className="required">*</span>
               <input type="text" placeholder="DD/MM/YYYY" {...register("dateofBirth")}/>
              </label>
               <p className="error">{errors.dateofBirth?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Country/Region *</label>
                <select {...register("country")}>
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
                <p className="error">{errors.country?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Pin Code *</label>
                <input type="text" {...register("pinCode")} />
                <p className="error">{errors.pinCode?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Email Address *</label>
                <input type="email" {...register("email")} />
                  
                <p className="error">{errors.email?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Create Password *</label>
                <input type="password" {...register("password")} />
                <p className="error">{errors.password?.message}</p>
              </div>
            </div>

            
            <div className="form-column">
              <div className="registrationform-group">
                <label>Last Name *</label>
                <input type="text" {...register("lastName")} />
                <p className="error">{errors.lastName?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Gender *</label>
                <select {...register("gender")}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="error">{errors.gender?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>State *</label>
                <input type="text" {...register("state")} />
                <p className="error">{errors.state?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Time Zone *</label>
                <input type="text" {...register("timeZone")} />
                <p className="error">{errors.timeZone?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Phone Number *</label>
                <input type="text" {...register("phoneNumber")} />
                <p className="error">{errors.phoneNumber?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Confirm Password *</label>
                <input type="password" {...register("confirmPassword")} />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>
            </div>
          </div>
        </div>
        <button type="register" disabled={loading} className="registersubmit-btn">
        Register Now</button>
             

              {showSuccessPopup && (
  <div className="popup">
    <div className="popup-content">
      <h3>Success!</h3>
      Registration successfully completed.
      <button onClick={() => setShowSuccessPopup(false)}><Link to="/login">Ok</Link></button>
    </div>
  </div>
)}
<div className="login-link">
      <h3>   Already a member? <Link to="/login">Login</Link></h3> 
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;

