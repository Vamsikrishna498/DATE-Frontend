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
    </div>
  );
};
 
export default ForgotUserId;