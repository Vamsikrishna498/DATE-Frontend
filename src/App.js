import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import FarmerRegistration from './pages/FarmerRegistration';
import EmployeeRegistration from './pages/EmployeeRegistration';
import RegistrationForm from './pages/RegistrationForm';
import ForgotPassword from './pages/ForgotPassword';
import ForgotUserId from './pages/ForgotUserid';
import ChangePassword from './pages/ChangePassword';
import ChangeUserId from './pages/ChangeUserId';
import OtpVerification from './pages/OtpVerification';
import ProtectedRoute from './components/ProtectedRoute';
import FarmerForm from "./pages/Formerform";
import Register from "./pages/RegistrationForm";
import ForgotUsername from "./pages/ForgotUserid";
import Viewfarmer from "./pages/Viewfarmer";
import Dashboard from "./pages/Dashboard";
import EmployeeDetails from "./pages/EmployeeDetails";
import AddFPOForm from "./pages/Fpo";
import Adminconfig from "./pages/Adminconfig";
import UserProfile from "./pages/UserProfile";
import { RegistrationList, FarmerList, EmployeeList } from "./pages/List";
import { RegistrationDetails } from "./pages/RegistrationDetails";
import Viewemployeedetails from "./pages/Viewemployeedetails";
import PrivateRoute from "./PrivateRoute";

import logo1 from "./assets/leftlogo.png";
import logo2 from "./assets/rightlogo.png";
import './App.css';

function Layout({ children, currentStep = 0, onStepChange }) {
  const steps = [
    "🏛️ Personal Information",
    "📌 Address",
    "👨‍🌾 Professional Information",
    "🌱 Current Crop Information",
    "🌾 Proposed Crop Information",
    "💧 Irrigation Details",
    "🔍 Other Information",
    "📄 Documents",
  ];

  return (
    <div className="infologo-container">
      <header className="infotop-bar">
        <img src={logo1} alt="Left Logo" className="infologo-left" />
        <img src={logo2} alt="Right Logo" className="infologo-right" />
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
        <u><h3>{steps[currentStep].replace(/^[^\w]+/, "").trim()}</h3></u>
      </div>

      <div className="content-container">{children}</div>
    </div>
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
    "/super-admin/dashboard",
    "/fpo-form",
    "/admin-config",
    "/employee-details",
    "/test-super-admin",
    "/admin/dashboard",
    "/employee/dashboard",
  ];

  // Dynamic View Routes
  if (location.pathname.startsWith("/view-farmer")) {
    return (
      <Routes>
        <Route path="/view-farmer/:farmerId" element={<Viewfarmer />} />
      </Routes>
    );
  }
  if (location.pathname.startsWith("/view-employee")) {
    return (
      <Routes>
        <Route path="/view-employee/:employeeId" element={<Viewemployeedetails />} />
      </Routes>
    );
  }

  // Static Routes
  if (noFrameRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-userid" element={<ChangeUserId />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
        <Route path="/registration-list" element={<RegistrationList />} />
        <Route path="/farmer-list" element={<FarmerList />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/fpo-form" element={<AddFPOForm />} />
        <Route path="/admin-config" element={<Adminconfig />} />
        <Route path="/dashboard/registration/:id" element={<RegistrationDetails />} />
        <Route
          path="/profile"
          element={localStorage.getItem("token") ? <UserProfile /> : <Navigate to="/login" />}
        />
        {/* Role-based dashboards */}
        <Route element={<PrivateRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/super-admin/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["EMPLOYEE"]} />}>
          <Route path="/employee/dashboard" element={<Dashboard />} />
        </Route>
        
        {/* TEST ROUTE: Super Admin Dashboard without authentication */}
        <Route path="/test-super-admin" element={<SuperAdminDashboard />} />
        
        {/* SIMPLE TEST ROUTE */}
        <Route path="/simple-test" element={
          <div style={{ 
            padding: '50px', 
            backgroundColor: 'red', 
            color: 'white',
            fontSize: '32px',
            textAlign: 'center',
            minHeight: '100vh'
          }}>
            <h1>🔴 SIMPLE TEST ROUTE</h1>
            <p>If you see this red page, routing is working!</p>
            <p>Time: {new Date().toLocaleString()}</p>
          </div>
        } />
      </Routes>
    );
  }

  // Default route for farmer form
  return (
    <Routes>
      <Route path="/" element={<Register />} /> 
      <Route path="/farmer-form" element={<FarmerFormWrapper />} /> 
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-userid" element={<ForgotUserId />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/change-userid" element={<ChangeUserId />} />
            
            {/* Registration Routes */}
            <Route path="/farmer/registration" element={<FarmerRegistration />} />
            <Route path="/employee/registration" element={<EmployeeRegistration />} />
            <Route path="/register-employee" element={<RegistrationForm />} />
            <Route path="/register-farmer" element={<RegistrationForm />} />
            <Route path="/register-fpo" element={<RegistrationForm />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
