import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { farmersAPI, employeesAPI, dashboardAPI } from '../api/apiService';
import '../styles/Dashboard.css';
import FarmerForm from '../components/FarmerForm';
import EmployeeForm from '../components/EmployeeForm';
import AssignmentModal from '../components/AssignmentModal';
import KYCDocumentUpload from '../components/KYCDocumentUpload';
import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';

import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('farmers');
  const [farmers, setFarmers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [showKYCDocumentUpload, setShowKYCDocumentUpload] = useState(false);
  const [selectedFarmerForKYC, setSelectedFarmerForKYC] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    region: '',
    kycStatus: '',
    assignmentStatus: '',
    registrationStatus: '',
    registrationRole: ''
  });

  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalFarmers: 0,
    totalEmployees: 0,
    unassignedFarmers: 0,
    approvedKyc: 0,
    pendingKyc: 0,
    kycCompletionRate: 0
  });
  const [locations, setLocations] = useState({ states: [], districts: [] });
  const [todoList, setTodoList] = useState({
    unassignedFarmers: [],
    employeesWithPendingTasks: [],
    totalUnassigned: 0,
    totalPendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load dashboard statistics
        const statsData = await dashboardAPI.getAdminDashboardStats();
        setDashboardStats(statsData);

        // Load farmers with KYC status
        const farmersData = await dashboardAPI.getFarmersWithKyc();
        setFarmers(farmersData);

        // Load employees with statistics
        const employeesData = await dashboardAPI.getEmployeesWithStats();
        setEmployees(employeesData);

        // Load locations for filters
        const locationsData = await dashboardAPI.getLocations();
        setLocations(locationsData);

        // Load todo list
        const todoData = await dashboardAPI.getAdminTodoList();
        setTodoList(todoData);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // Fallback to mock data if API fails
        const mockFarmers = [
          {
            id: 1,
            name: 'Rajesh Kumar',
            contactNumber: '9876543210',
            state: 'Maharashtra',
            district: 'Pune',
            kycStatus: 'APPROVED',
            assignedEmployee: 'John Doe',
            assignedEmployeeId: 1
          }
        ];
        const mockEmployees = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@agri.com',
            contactNumber: '9876543200',
            state: 'Maharashtra',
            district: 'Pune',
            totalAssigned: 25,
            approvedKyc: 15,
            pendingKyc: 8
          }
        ];
        
        setFarmers(mockFarmers);
        setEmployees(mockEmployees);
        setDashboardStats({
          totalFarmers: 1250,
          totalEmployees: 25,
          unassignedFarmers: 45,
          approvedKyc: 1150,
          pendingKyc: 78,
          kycCompletionRate: 92.0
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getFilteredFarmers = () => {
    return farmers.filter(farmer => {
      const matchesState = !filters.state || farmer.state === filters.state;
      const matchesDistrict = !filters.district || farmer.district === filters.district;
      const matchesKycStatus = !filters.kycStatus || farmer.kycStatus === filters.kycStatus;
      const matchesAssignmentStatus = !filters.assignmentStatus || 
        (filters.assignmentStatus === 'ASSIGNED' ? farmer.assignedEmployee : !farmer.assignedEmployee);
      
      return matchesState && matchesDistrict && matchesKycStatus && matchesAssignmentStatus;
    });
  };

  const getFilteredEmployees = () => {
    if (!selectedEmployee) return employees;
    return employees.filter(emp => emp.id === parseInt(selectedEmployee));
  };

  const getStats = () => {
    return {
      totalFarmers: dashboardStats.totalFarmers,
      unassignedFarmers: dashboardStats.unassignedFarmers,
      pendingKyc: dashboardStats.pendingKyc,
      approvedKyc: dashboardStats.approvedKyc,
      kycCompletionRate: dashboardStats.kycCompletionRate
    };
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewFarmer = (farmer) => {
    // Convert the farmer data to match the registration form structure
    const farmerData = {
      firstName: farmer.name.split(' ')[0] || '',
      lastName: farmer.name.split(' ').slice(1).join(' ') || '',
      mobileNumber: farmer.phone,
      state: farmer.state,
      district: farmer.district,
      region: farmer.region,
      kycStatus: farmer.kycStatus,
      status: farmer.assignmentStatus,
      assignedEmployee: farmer.assignedEmployee,
      assignedDate: farmer.assignedDate,
      // Add mock data for other fields
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      email: 'farmer@example.com',
      maritalStatus: 'Married',
      religion: 'Hindu',
      caste: 'General',
      category: 'General',
      education: 'High School',
      village: 'Sample Village',
      postOffice: 'Sample Post Office',
      policeStation: 'Sample Police Station',
      pincode: '123456',
      occupation: 'Farmer',
      annualIncome: '50000',
      landOwnership: 'Owned',
      landArea: '5',
      irrigationType: 'Tube Well',
      soilType: 'Alluvial',
      primaryCrop: 'Wheat',
      secondaryCrop: 'Rice',
      cropSeason: 'Rabi',
      farmingExperience: '10',
      bankName: 'State Bank of India',
      branchName: 'Main Branch',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      accountType: 'Savings',
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      voterId: 'ABC1234567',
      rationCardNumber: '123456789',
      registrationDate: farmer.assignedDate || new Date().toISOString(),
      photo: null
    };
    
    setSelectedFarmerData(farmerData);
    setShowFarmerDetails(true);
  };

  const handleCloseFarmerDetails = () => {
    setShowFarmerDetails(false);
    setSelectedFarmerData(null);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployeeData(employee);
    setShowEmployeeDetails(true);
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };

  const handleUpdateEmployee = (updatedData) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployeeData.id ? { ...emp, ...updatedData } : emp
    ));
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };





  const handleKYCDocumentUpload = (farmer) => {
    setSelectedFarmerForKYC(farmer);
    setShowKYCDocumentUpload(true);
  };

  const handleCloseKYCDocumentUpload = () => {
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleKYCApprove = (farmerId, documents) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === farmerId 
        ? { ...farmer, kycStatus: 'APPROVED' }
        : farmer
    ));
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleKYCReject = (farmerId, reason, documents) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === farmerId 
        ? { ...farmer, kycStatus: 'REJECTED' }
        : farmer
    ));
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const handleKYCReferBack = (farmerId, reason, documents) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === farmerId 
        ? { ...farmer, kycStatus: 'REFER_BACK' }
        : farmer
    ));
    setShowKYCDocumentUpload(false);
    setSelectedFarmerForKYC(null);
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Farmers"
              value={getStats().totalFarmers}
              icon="👨‍🌾"
              color="blue"
            />
            <StatsCard
              title="Unassigned Farmers"
              value={getStats().unassignedFarmers}
              icon="📋"
              color="orange"
            />
            <StatsCard
              title="Pending KYC"
              value={getStats().pendingKyc}
              icon="⏳"
              color="yellow"
            />
            <StatsCard
              title="Approved KYC"
              value={getStats().approvedKyc}
              icon="✅"
              color="green"
            />
            <StatsCard
              title="KYC Completion Rate"
              value={`${getStats().kycCompletionRate}%`}
              icon="📊"
              color="purple"
            />
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={() => setShowFarmerForm(true)}
              >
                ➕ Add Farmer
              </button>
              <button 
                className="action-btn primary"
                onClick={() => setShowEmployeeForm(true)}
              >
                ➕ Add Employee
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setShowAssignmentModal(true)}
              >
                🔗 Assign Farmers
              </button>
            </div>
          </div>

          <div className="todo-panel">
            <h3>To-Do List</h3>
            <div className="todo-items">
              {todoList.totalUnassigned > 0 && (
                <div className="todo-item">
                  <span className="todo-icon">📋</span>
                  <span>{todoList.totalUnassigned} farmers need assignment</span>
                </div>
              )}
              {todoList.totalPendingTasks > 0 && (
                <div className="todo-item">
                  <span className="todo-icon">⚠️</span>
                  <span>{todoList.totalPendingTasks} pending tasks</span>
                </div>
              )}
              {todoList.employeesWithPendingTasks.map(emp => (
                <div key={emp.id} className="todo-item">
                  <span className="todo-icon">📊</span>
                  <span>{emp.name} has {emp.pendingKycCount} pending cases</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderFarmers = () => (
    <div className="dashboard-content">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading farmers data...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="filters-section">
            <h3>Farmer Management</h3>
            <div className="filters">
              <select 
                value={filters.state} 
                onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
              >
                <option value="">All States</option>
                {locations.states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <select 
                value={filters.district} 
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
              >
                <option value="">All Districts</option>
                {locations.districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <select 
                value={filters.kycStatus} 
                onChange={(e) => setFilters(prev => ({ ...prev, kycStatus: e.target.value }))}
              >
                <option value="">All KYC Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REFER_BACK">Refer Back</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select 
                value={filters.assignmentStatus} 
                onChange={(e) => setFilters(prev => ({ ...prev, assignmentStatus: e.target.value }))}
              >
                <option value="">All Assignment Status</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNASSIGNED">Unassigned</option>
              </select>
            </div>
          </div>

          <DataTable
            data={getFilteredFarmers()}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'contactNumber', label: 'Phone' },
              { key: 'state', label: 'State' },
              { key: 'district', label: 'District' },
              { key: 'kycStatus', label: 'KYC Status' },
              { key: 'assignedEmployee', label: 'Assigned Employee' }
            ]}
            onView={handleViewFarmer}
            onEdit={(farmer) => {
              console.log('Edit farmer:', farmer);
              setShowFarmerForm(true);
            }}
            customActions={[
              {
                icon: '📁',
                label: 'KYC Docs',
                className: 'secondary',
                onClick: handleKYCDocumentUpload
              }
            ]}
          />
        </>
      )}
    </div>
  );

  const renderEmployees = () => (
    <div className="dashboard-content">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading employees data...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="filters-section">
            <h3>Employee Management</h3>
            <div className="filters">
              <select 
                value={selectedEmployee} 
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            data={getFilteredEmployees()}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'contactNumber', label: 'Phone' },
              { key: 'state', label: 'State' },
              { key: 'district', label: 'District' },
              { key: 'totalAssigned', label: 'Total Assigned' },
              { key: 'approvedKyc', label: 'Approved KYC' },
              { key: 'pendingKyc', label: 'Pending KYC' }
            ]}
            onView={handleViewEmployee}
            onEdit={(employee) => {
              setShowEmployeeForm(true);
              console.log('Edit employee:', employee);
            }}
          />
        </>
      )}
    </div>
  );



  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${currentView === 'overview' ? 'active' : ''}`}
          onClick={() => setCurrentView('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${currentView === 'farmers' ? 'active' : ''}`}
          onClick={() => setCurrentView('farmers')}
        >
          👨‍🌾 Farmers
        </button>
        <button 
          className={`nav-btn ${currentView === 'employees' ? 'active' : ''}`}
          onClick={() => setCurrentView('employees')}
        >
          👥 Employees
        </button>

      </div>

      <div className="dashboard-main">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'farmers' && renderFarmers()}
        {currentView === 'employees' && renderEmployees()}

      </div>

      {showFarmerForm && (
        <FarmerForm 
          onClose={() => setShowFarmerForm(false)}
          onSubmit={(farmerData) => {
            setFarmers(prev => [...prev, { ...farmerData, id: Date.now() }]);
            setShowFarmerForm(false);
          }}
        />
      )}

      {showEmployeeForm && (
        <EmployeeForm 
          onClose={() => setShowEmployeeForm(false)}
          onSubmit={(employeeData) => {
            setEmployees(prev => [...prev, { ...employeeData, id: Date.now() }]);
            setShowEmployeeForm(false);
          }}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal 
          farmers={farmers.filter(f => f.assignmentStatus === 'UNASSIGNED')}
          employees={employees}
          onClose={() => setShowAssignmentModal(false)}
          onAssign={(assignments) => {
            setFarmers(prev => prev.map(farmer => {
              const assignment = assignments.find(a => a.farmerId === farmer.id);
              if (assignment) {
                return {
                  ...farmer,
                  assignmentStatus: 'ASSIGNED',
                  assignedEmployee: assignment.employeeName,
                  assignedDate: new Date().toISOString().split('T')[0]
                };
              }
              return farmer;
            }));
            setShowAssignmentModal(false);
          }}
        />
      )}

                       {showFarmerDetails && (
                   <ViewFarmerRegistrationDetails
                     farmerData={selectedFarmerData}
                     onClose={handleCloseFarmerDetails}
                   />
                 )}
                 {showEmployeeDetails && (
                   <ViewEditEmployeeDetails
                     employeeData={selectedEmployeeData}
                     onClose={handleCloseEmployeeDetails}
                     onUpdate={handleUpdateEmployee}
                   />
                 )}


                 {showKYCDocumentUpload && (
                   <KYCDocumentUpload
                     isOpen={showKYCDocumentUpload}
                     onClose={handleCloseKYCDocumentUpload}
                     farmer={selectedFarmerForKYC}
                     onApprove={handleKYCApprove}
                     onReject={handleKYCReject}
                     onReferBack={handleKYCReferBack}
                   />
                 )}
               </div>
             );
           };
         }
       }
     }
   }
 };

export default AdminDashboard; 