import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../styles/Dashboard.css";
import logo2 from "../assets/rightlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding, faUsers } from "@fortawesome/free-solid-svg-icons";
import { RegistrationList, FarmerList, EmployeeList } from "../pages/List";
import ViewAllActivityModal from "../pages/ViewAllActivityModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [farmerCount, setFarmerCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [activeView, setActiveView] = useState("dashboard");
  const [farmerData, setFarmerData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [photoPreviewStep0, setPhotoPreviewStep0] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();

  const handleToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        const farmerRes = await axios.get("http://localhost:8080/api/dashboard/farmers", { headers });
        setFarmerCount(farmerRes.data.length);

        const employeeRes = await axios.get("http://localhost:8080/api/employees", { headers });
        setEmployeeCount(employeeRes.data.length);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/farmers/5")
      .then((res) => res.json())
      .then((data) => setFarmerData(data))
      .catch((err) => console.error(err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setProfileMenuOpen((open) => !open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleChangePassword = () => {
    window.location.href = "/change-password";
  };

  const handleSettings = () => {
    window.location.href = "/profile";
  };

  const handleGenerateReport = () => {
    alert("Report generation feature coming soon!");
  };

  const handleAnalytics = () => {
    navigate("/analytics");
  };

  return (
    <div className="dashboard-container">
      <header className="dash-bar">
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
        {/* Only show the new profile dropdown at the top right */}
        <div className="profile-dropdown-wrapper" ref={profileRef}>
          <div className="profile-circle" onClick={handleProfileClick}>
            <span role="img" aria-label="User" style={{fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>👤</span>
          </div>
          <span className="chevron-down" onClick={handleProfileClick}>▼</span>
          {profileMenuOpen && (
            <div className="profile-dropdown-menu">
              <button onClick={handleSettings}>Settings</button>
              <button onClick={handleChangePassword}>Change Password</button>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </header>

      <div className="banner-image" />

      <div className="dashboard-grid">
  {/* Sidebar */}
  <div className="dashboard-sidebar">
    <ul className="sidebar-menu">
      <li>
        <button className={`dash-link-button ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>
          📊 Dashboard
        </button>
      </li>

      {/* Registration */}
      <li onClick={() => handleToggle("registration")} className={`has-submenu ${openMenu === "registration" ? "open" : ""}`}>
        📝 Registration
        {openMenu === "registration" && (
          <ul className="submenu">
            <li>
              <button className="link-button" onClick={() => setActiveView("registrationList")}>
                📄 View Registrations
              </button>
            </li>
          </ul>
        )}
      </li>

      {/* Farmers */}
      <li onClick={() => handleToggle("farmers")} className={`has-submenu ${openMenu === "farmers" ? "open" : ""}`}>
        👨‍🌾 Farmers
        {openMenu === "farmers" && (
          <ul className="submenu">
            <li><Link to="/farmer-form" className="link-button">➕ Add Farmer</Link></li>
            <li><button className="link-button" onClick={() => setActiveView("farmersList")}>📋 View Farmers</button></li>
          </ul>
        )}
      </li>

      {/* Employees */}
      <li onClick={() => handleToggle("employees")} className={`has-submenu ${openMenu === "employees" ? "open" : ""}`}>
        👔 Employees
        {openMenu === "employees" && (
          <ul className="submenu">
            <li><Link to="/employee-details" className="link-button">➕ Add Employee</Link></li>
            <li><button className="link-button" onClick={() => setActiveView("employeesList")}>📋 View Employees</button></li>
          </ul>
        )}
      </li>
    </ul>
  </div>
        {/* Main */}
        <div className="dashboard-main">
          {activeView === "dashboard" && (
            <>
            <div className="dashboard-filters">
            <div className="dashboard-title-grid">
              <div className="dashboard-title">Dashboard Overview</div>
              <h3>Welcome back! Here's what's happening with your agricultural data.</h3>
              </div>
              
                <div className="filter-buttons">
                  <button className="refresh-button">🔔 Refresh</button>
                 <div className="filter-group">
                 <button
                   className={selectedFilter === "Today" ? "active" : ""}
                   onClick={() => setSelectedFilter("Today")}
                  >
                    Today
                   </button>
                    <button
                        className={selectedFilter === "This Month" ? "active" : ""}
                      onClick={() => setSelectedFilter("This Month")}
                     >
                     This Month
                      </button>
                   <button
                      className={selectedFilter === "This Year" ? "active" : ""}
                      onClick={() => setSelectedFilter("This Year")}
                    >
                     This Year
                   </button>
                      </div>
                </div>
              </div>
              <div className="card-wrapper-modern">
                <div className="modern-card">
                  <div className="modern-icon green"><FontAwesomeIcon icon={faUsers} /></div>
                  <div className="modern-info">
                    <div className="modern-title">Farmers</div>
                    <div className="modern-count">{farmerCount}</div>
                    <div className="modern-change positive">+12.4%</div>
                  </div>
                </div>
                <div className="modern-card">
                  <div className="modern-icon blue"><FontAwesomeIcon icon={faUser} /></div>
                  <div className="modern-info">
                    <div className="modern-title">Employees</div>
                    <div className="modern-count">{employeeCount}</div>
                    <div className="modern-change negative">-3.0%</div>
                  </div>
                </div>
                <div className="modern-card">
                  <div className="modern-icon violet"><FontAwesomeIcon icon={faBuilding} /></div>
                  <div className="modern-info">
                    <div className="modern-title">FPO</div>
                    <div className="modern-count">0</div>
                    <div className="modern-change neutral">+0.0%</div>
                  </div>
                </div>
              </div>

             

              <div className="dashboard-sections">
                <div className="recent-activities">
                  <ul className="activity-list">
                     <li><h3> Recent Activities{" "}</h3>
                     <span className="view-all" onClick={() => setShowActivityModal(true)}>View All</span></li>
                     <li><span className="activity-dot green" /> Farmer profile updated:  <span className="activity-time">20m ago</span> <span className="activity-status success">success</span></li>
                     <li><span className="activity-dot red" /> Employee profile updated:  <span className="activity-time">10m ago</span> <span className="activity-status success">success</span></li>
                    <li><span className="activity-dot purple" /> New FPO application submitted <span className="activity-time">Just now</span> <span className="activity-status pending">pending</span></li>
                  </ul>
                </div>
                <div className="quick-actions">
                  <div className="section-title">Quick Actions</div>
                  <div className="action-grid">
                    <button className="quick-btn green" onClick={() => navigate("/farmer-form")}>👨‍🌾 Add New Farmer</button>
                    <button className="quick-btn blue" onClick={() => navigate("/employee-details")}>👤 Add Employee</button>
                    <button className="quick-btn violet" onClick={handleGenerateReport}>📊 Generate Report</button>
                    <button className="quick-btn gray" onClick={handleAnalytics}>📈 View Analytics</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === "registrationList" && <RegistrationList />}
          {activeView === "farmersList" && <FarmerList />}
          {activeView === "employeesList" && <EmployeeList />}
          <ViewAllActivityModal
  isOpen={showActivityModal}
  onClose={() => setShowActivityModal(false)}
/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
