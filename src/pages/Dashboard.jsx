 import React, { useState, useEffect } from "react";
 import { useNavigate, Link } from "react-router-dom";
 import axios from "axios";
 import "../styles/Dashboard.css";
 import logo1 from "../assets/leftlogo.png";
 import logo2 from "../assets/rightlogo.png";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faUser, faPersonDigging } from "@fortawesome/free-solid-svg-icons";
 import { RegistrationList, FarmerList, EmployeeList } from "../pages/List";

  const Dashboard = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [farmerCount, setFarmerCount] = useState(0);
  const [farmerList, setFarmerList] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const handleToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const countRes = await axios.get("http://localhost:8080/api/dashboard/count", { headers });
        setFarmerCount(countRes.data);

        const farmersRes = await axios.get("http://localhost:8080/api/dashboard/farmers", { headers });
        setFarmerList(farmersRes.data);

        if (farmersRes.data.length > 0) {
          const sampleId = farmersRes.data[0].id;
          const detailRes = await axios.get(`http://localhost:8080/api/dashboard/farmers/${sampleId}`, { headers });
          setSelectedFarmer(detailRes.data);
        }
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dash-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>

      <div className="banner-image" />

      <div className="dashboard-grid">
        {/* Sidebar */}
          <div className="dashboard-sidebar">
       <ul className="sidebar-menu">
          <button className="dash-link-button" onClick={() => setActiveView("dashboard")}>
           <h3> Dashboard </h3>
          </button>
          </ul>
          <ul className="sidebar-menu">
           <li onClick={() => handleToggle("registration")} className="has-submenu">
            Registration
             {openMenu === "registration" && (
          <ul className="submenu">
          <li>
          <button
          className="link-button"
          onClick={() => setActiveView("registrationList")}
          >
          View list
          </button>
          </li>
          </ul>
         )}
          </li>
           <li onClick={() => handleToggle("farmers")} className="has-submenu">
           Farmers
           {openMenu === "farmers" && (
           <ul className="submenu">
           <li><Link to="/farmer-form">Add Farmer</Link></li>
           <li>
           <button
           className="link-button"
           onClick={() => setActiveView("farmersList")}
           >
           View list
           </button>
          </li>
          </ul>
          )}
         </li>
           <li onClick={() => handleToggle("employees")} className="has-submenu">
           Employees
            {openMenu === "employees" && (
           <ul className="submenu">
           <li><Link to="/employee-details">Add Employees</Link></li>
           <li>
           <button
           className="link-button"
           onClick={() => setActiveView("employeesList")}
           >
           View list
           </button>
           </li>
           </ul>
            )}
            </li> 
            </ul>
            </div>
            <div className="dashboard-main">
            {activeView === "dashboard" && (
            <>
             <div className="dashboard-title">Dashboard</div>
               <div className="card-wrapper">
           {/* Your cards */}
            <div className="card">
            <h3 className="card-title blue">Total Farmers</h3>
            <div className="card-icon"><FontAwesomeIcon icon={faPersonDigging} size="2x" /></div>
            <div>{farmerCount}</div>
            <div className="percentage">+5% increase</div>
            </div>
            <div className="card">
            <h3 className="card-title blue">Employees</h3>
            <div className="card-icon"><FontAwesomeIcon icon={faUser} /></div>
            <div>0</div>
            <div className="percentage">0% increase</div>
            </div>
           <div className="card">
          <h3 className="card-title blue">FPO</h3>
          <div className="card-icon"><FontAwesomeIcon icon={faUser} /></div>
          <div>0</div>
          <div className="percentage">0% increase</div>
        </div>
        {selectedFarmer && (
          <div className="card">
            <h3 className="card-title blue">Sample Farmer</h3>
            <div>{selectedFarmer.firstName} {selectedFarmer.lastName}</div>
            <div>Phone: {selectedFarmer.phoneNumber}</div>
          </div>
        )}
      </div>
    </>
  )}

         {activeView === "registrationList" && <RegistrationList />}
         {activeView === "farmersList" && <FarmerList />}
         {activeView === "employeesList" && <EmployeeList />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
