//app.js  working code


import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import FarmerForm from "./pages/Formerform";
import Login from "./pages/Login";
import Register from "./pages/RegistrationForm";
import ForgotUsername from "./pages/ForgotUserid";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ChangeUserId from "./pages/ChangeUserId";
import ChangePassword from "./pages/ChangePassword";
import Viewfarmer from "./pages/Viewfarmer";
import Dashboard from "./pages/Dashboard";
import EmployeeDetails from "./pages/EmployeeDetails";
import AddFPOForm from "./pages/Fpo";
import Adminconfig from "./pages/Adminconfig"; 
import logo1 from "./assets/leftlogo.png";
import logo2 from "./assets/rightlogo.png";
import "./App.css";
import UserProfile from "./pages/UserProfile";
import { RegistrationList, FarmerList, EmployeeList } from "./pages/List";
import { RegistrationDetails } from "./pages/RegistrationDetails";
 
function Layout({ children, currentStep = 0, onStepChange }) {
  const steps = [
    "\uD83C\uDFDB\uFE0F Personal Information",
    "\uD83D\uDCCC Address",
    "\uD83D\uDC68‍\uD83C\uDF3E Professional Information",
    "\uD83C\uDF31 Current Crop Information",
    "\uD83C\uDF3E Proposed Crop Information",
    "\uD83D\uDCA7 Irrigation Details",
    "\uD83D\uDD0D Other Information",
    "\uD83D\uDCC4 Documents",
  ];
 
  return (
    <div className="infologo-container">
      <header className="infotop-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>
 
      <div className="infomiddle-container">
        <nav className="infonav-links">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`infonav-item ${index === currentStep ? "active" : ""}`}
              onClick={() => onStepChange(index)}
              style={{ cursor: "pointer" }}
            >
              {label}
            </div>
          ))}
        </nav>
      </div>
 
      <div className="form-title">
        <u>
          <h3>{steps[currentStep].replace(/^[^\w]+/, "").trim()}</h3>
        </u>
      </div>
 
      <div className="content-container">{children}</div>
    </div>
  );
}
 
function AppContent() {
  const location = useLocation();
 
 const noFrameRoutes = [
  "/login",
  "/register",
  "/forgot-username",
  "/forgot-password",
  "/change-userid",
  "/change-password",
  "/otp-verification",
  "/dashboard",
  "/fpo-form",
  "/admin-config",
  "/employee-details"
];
 
  if (location.pathname.startsWith("/view-farmer")) {
    return (
      <Routes>
        <Route path="/view-farmer/:farmerId" element={<Viewfarmer />} />
      </Routes>
    );
  }
  
 
  if (noFrameRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-userid" element={<ChangeUserId />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration-list" element={<RegistrationList />} />
        <Route path="/farmer-list" element={<FarmerList />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/fpo-form" element={<AddFPOForm />} />
        <Route path="/admin-config" element={<Adminconfig />} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
        <Route path="/dashboard/registration/:id" element={<RegistrationDetails />} />
        <Route
          path="/profile"
          element={localStorage.getItem("token") ? <UserProfile /> : <Navigate to="/login" />}
        />
      </Routes>
    );
  }
    <Route
  path="/registrations/:id"
  element={
    <Dashboard>
      <RegistrationDetails />
    </Dashboard>
  }
/>
  return (
    <Routes>
      <Route path="/farmer-form" element={<FarmerFormWrapper />} />
      <Route path="/" element={<Register />} />
    </Routes>
  );
}
 
function FarmerFormWrapper() {
  const [currentStep, setCurrentStep] = useState(0);
 
  return (
    <Layout currentStep={currentStep} onStepChange={setCurrentStep}>
      <FarmerForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </Layout>
  );
}
 
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
 
export default App;