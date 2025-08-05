import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { superAdminAPI } from '../api/apiService';
import '../styles/Dashboard.css';
import FarmerForm from '../components/FarmerForm';
import EmployeeForm from '../components/EmployeeForm';
import AssignmentModal from '../components/AssignmentModal';
import DeleteModal from '../components/DeleteModal';
import KYCDocumentUpload from '../components/KYCDocumentUpload';
import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';
import RegistrationApprovalModal from '../components/RegistrationApprovalModal';

import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [farmers, setFarmers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [deletedRecords, setDeletedRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [showKYCDocumentUpload, setShowKYCDocumentUpload] = useState(false);
  const [selectedFarmerForKYC, setSelectedFarmerForKYC] = useState(null);
  const [showRegistrationApproval, setShowRegistrationApproval] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    region: '',
    kycStatus: '',
    assignmentStatus: '',
    registrationStatus: '',
    registrationRole: ''
  });

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalEmployees: 0,
    totalAdmins: 0,
    pendingRegistrations: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    recentRegistrations: 0,
    kycCompletionRate: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });
  const [employeeStats, setEmployeeStats] = useState([]);
  const [todoItems, setTodoItems] = useState({
    pendingRegistrations: 0,
    pendingKycApprovals: 0,
    unassignedFarmers: 0,
    overdueTasks: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load dashboard statistics
        const statsData = await superAdminAPI.getDashboardStats();
        setDashboardStats(statsData);

        // Load employee statistics
        const employeeStatsData = await superAdminAPI.getEmployeeStats();
        setEmployeeStats(employeeStatsData);

        // Load todo items
        const todoData = await superAdminAPI.getTodoItems();
        setTodoItems(todoData);

        // Load registrations
        const registrationsData = await superAdminAPI.getAllRegistrations();
        console.log('Loaded registrations:', registrationsData);
        setRegistrations(registrationsData);

        // Load farmers
        const farmersData = await superAdminAPI.getAllFarmers();
        setFarmers(farmersData);

        // Load employees
        const employeesData = await superAdminAPI.getAllEmployees();
        setEmployees(employeesData);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // Fallback to mock data if API fails
        const mockFarmers = [
          {
            id: 1,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            contactNumber: '9876543210',
            state: 'Maharashtra',
            district: 'Pune',
            kycStatus: 'APPROVED',
            status: 'ACTIVE'
          }
        ];
        const mockEmployees = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@agri.com',
            contactNumber: '9876543200',
            role: 'FIELD_OFFICER',
            status: 'ACTIVE'
          }
        ];
        
        setFarmers(mockFarmers);
        setEmployees(mockEmployees);
        setRegistrations([]);
        setDashboardStats({
          totalUsers: 1500,
          totalFarmers: 1200,
          totalEmployees: 250,
          totalAdmins: 50,
          pendingRegistrations: 25,
          approvedUsers: 1475,
          rejectedUsers: 0,
          recentRegistrations: 15,
          kycCompletionRate: 85.5,
          activeUsers: 1450,
          inactiveUsers: 50
        });
        setEmployeeStats([]);
        setTodoItems({
          pendingRegistrations: 25,
          pendingKycApprovals: 45,
          unassignedFarmers: 30,
          overdueTasks: 5,
          recentActivities: []
        });
        
        // Add mock registrations for testing
        const mockRegistrations = [
          {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            phoneNumber: '9876543210',
            role: 'EMPLOYEE',
            status: 'PENDING',
            dateOfBirth: '1990-01-01',
            gender: 'Male',
            registrationDate: new Date().toISOString()
          }
        ];
        setRegistrations(mockRegistrations);
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
      
      return matchesState && matchesDistrict && matchesKycStatus;
    });
  };

  const getFilteredEmployees = () => {
    if (!selectedEmployee) return employees;
    return employees.filter(emp => emp.id === parseInt(selectedEmployee));
  };

  const getFilteredRegistrations = () => {
    return registrations.filter(registration => {
      const matchesStatus = !filters.registrationStatus || registration.status === filters.registrationStatus;
      const matchesRole = !filters.registrationRole || registration.role === filters.registrationRole;
      
      return matchesStatus && matchesRole;
    });
  };

  const getStats = () => {
    return {
      totalUsers: dashboardStats.totalUsers,
      totalFarmers: dashboardStats.totalFarmers,
      totalEmployees: dashboardStats.totalEmployees,
      pendingRegistrations: dashboardStats.pendingRegistrations,
      approvedUsers: dashboardStats.approvedUsers,
      rejectedUsers: dashboardStats.rejectedUsers,
      kycCompletionRate: dashboardStats.kycCompletionRate
    };
  };

  const handleDelete = async (item, type) => {
    console.log('Delete clicked:', item, type);
    setItemToDelete({ item, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { item, type } = itemToDelete;
    
    try {
      if (type === 'farmer') {
        await superAdminAPI.deleteFarmer(item.id);
        setFarmers(prev => prev.filter(f => f.id !== item.id));
      } else if (type === 'employee') {
        await superAdminAPI.deleteEmployee(item.id);
        setEmployees(prev => prev.filter(e => e.id !== item.id));
      } else if (type === 'user') {
        await superAdminAPI.deleteUser(item.id);
        setRegistrations(prev => prev.filter(r => r.id !== item.id));
      }

      const deletedRecord = {
        id: item.id,
        entityType: type,
        entityName: item.name || item.email || `${item.firstName} ${item.lastName}`,
        deletedBy: user.name,
        deletedAt: new Date().toISOString(),
        reason: itemToDelete.reason || 'No reason provided'
      };

      setDeletedRecords(prev => [...prev, deletedRecord]);
      setShowDeleteModal(false);
      setItemToDelete(null);
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleApproveRegistration = async (registrationId, role) => {
    try {
      console.log('🚀 APPROVING REGISTRATION:', registrationId, 'with role:', role);
      
      // First, get the current user status
      console.log('📞 Checking user status first...');
      const userResponse = await superAdminAPI.getUserById(registrationId);
      console.log('📋 Current user data:', userResponse);
      
      if (!userResponse) {
        alert('User not found!');
        return;
      }
      
      const currentStatus = userResponse.status;
      console.log('📊 Current user status:', currentStatus);
      
      if (currentStatus === 'APPROVED') {
        alert('User is already approved!');
        return;
      }
      
      if (currentStatus === 'PENDING') {
        // Use approve endpoint for pending users
        console.log('📞 Calling approveUser API for PENDING user...');
        const result = await superAdminAPI.approveUser(registrationId, role);
        console.log('✅ API Response:', result);
        
        // Update the registration status locally
        setRegistrations(prev => prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: 'APPROVED', approvedBy: user.name, approvalDate: new Date().toISOString() }
            : reg
        ));
        
        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          pendingRegistrations: prev.pendingRegistrations - 1,
          approvedUsers: prev.approvedUsers + 1
        }));
        
        setShowRegistrationApproval(false);
        setSelectedRegistration(null);
        alert('Registration approved successfully!');
      } else {
        // For other statuses (like REJECTED), update status to APPROVED
        console.log('📞 Updating user status to APPROVED...');
        const result = await superAdminAPI.updateUserStatus(registrationId, 'APPROVED');
        console.log('✅ API Response:', result);
        
        // Update the registration status locally
        setRegistrations(prev => prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: 'APPROVED', approvedBy: user.name, approvalDate: new Date().toISOString() }
            : reg
        ));
        
        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          pendingRegistrations: prev.pendingRegistrations - 1,
          approvedUsers: prev.approvedUsers + 1
        }));
        
        setShowRegistrationApproval(false);
        setSelectedRegistration(null);
        alert('User status updated to approved!');
      }
      
    } catch (error) {
      console.error('❌ Error approving registration:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      
      // Show more specific error message
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to approve registration: ${errorMessage}`);
    }
  };

  const handleRejectRegistration = async (registrationId, reason) => {
    try {
      console.log('🚀 REJECTING REGISTRATION:', registrationId, 'with reason:', reason);
      console.log('📞 Calling API: superAdminAPI.updateUserStatus');
      
      const result = await superAdminAPI.updateUserStatus(registrationId, 'REJECTED');
      console.log('✅ API Response:', result);
      
      // Update the registration status locally
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId 
          ? { 
              ...reg, 
              status: 'REJECTED', 
              rejectedBy: user.name, 
              rejectionDate: new Date().toISOString(),
              rejectionReason: reason
            }
          : reg
      ));
      
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        pendingRegistrations: prev.pendingRegistrations - 1,
        rejectedUsers: prev.rejectedUsers + 1
      }));
      
      setShowRegistrationApproval(false);
      setSelectedRegistration(null);
      alert('Registration rejected successfully!');
    } catch (error) {
      console.error('❌ Error rejecting registration:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      alert('Failed to reject registration. Please try again.');
    }
  };

  const handleViewRegistration = (registration) => {
    console.log('View registration clicked:', registration);
    console.log('Registration status:', registration.status);
    console.log('Registration role:', registration.role);
    setSelectedRegistration(registration);
    setShowRegistrationApproval(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewFarmer = (farmer) => {
    // Convert the farmer data to match the registration form structure
    const farmerData = {
      firstName: farmer.firstName || '',
      lastName: farmer.lastName || '',
      mobileNumber: farmer.contactNumber,
      state: farmer.state,
      district: farmer.district,
      kycStatus: farmer.kycStatus,
      status: farmer.status,
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
      registrationDate: new Date().toISOString(),
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

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      );
    }

    const stats = getStats();

    return (
      <div className="dashboard-content">
        <div className="stats-grid">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="blue"
          />
          <StatsCard
            title="Total Farmers"
            value={stats.totalFarmers}
            icon="👨‍🌾"
            color="green"
          />
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon="👷"
            color="orange"
          />
          <StatsCard
            title="Pending Registrations"
            value={stats.pendingRegistrations}
            icon="⏳"
            color="yellow"
          />
          <StatsCard
            title="Approved Users"
            value={stats.approvedUsers}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="KYC Completion Rate"
            value={`${stats.kycCompletionRate}%`}
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
              onClick={() => setCurrentView('registrations')}
            >
              📋 Review Registrations
            </button>
          </div>
        </div>

        <div className="todo-panel">
          <h3>To-Do List</h3>
          <div className="todo-items">
            {todoItems.pendingRegistrations > 0 && (
              <div className="todo-item">
                <span className="todo-icon">📋</span>
                <span>{todoItems.pendingRegistrations} registrations need approval</span>
              </div>
            )}
            {todoItems.pendingKycApprovals > 0 && (
              <div className="todo-item">
                <span className="todo-icon">📄</span>
                <span>{todoItems.pendingKycApprovals} KYC approvals pending</span>
              </div>
            )}
            {todoItems.unassignedFarmers > 0 && (
              <div className="todo-item">
                <span className="todo-icon">🔗</span>
                <span>{todoItems.unassignedFarmers} farmers need assignment</span>
              </div>
            )}
            {todoItems.overdueTasks > 0 && (
              <div className="todo-item">
                <span className="todo-icon">⚠️</span>
                <span>{todoItems.overdueTasks} tasks overdue</span>
              </div>
            )}
            {todoItems.recentActivities && todoItems.recentActivities.length > 0 && 
              todoItems.recentActivities.map((activity, index) => (
                <div key={index} className="todo-item">
                  <span className="todo-icon">📝</span>
                  <span>{activity.message}</span>
                  <small>{new Date(activity.timestamp).toLocaleDateString()}</small>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  };

  const renderRegistrations = () => (
    <div className="dashboard-content">
      <div className="filters-section">
        <h3>Registration Management</h3>
        <div className="filters">
          <select 
            value={filters.registrationStatus} 
            onChange={(e) => setFilters(prev => ({ ...prev, registrationStatus: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select 
            value={filters.registrationRole} 
            onChange={(e) => setFilters(prev => ({ ...prev, registrationRole: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="FARMER">Farmer</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          {/* Test button */}
          <button 
            onClick={() => {
              const testRegistration = {
                id: 999,
                name: 'Test User',
                email: 'test@example.com',
                phoneNumber: '9876543210',
                role: 'EMPLOYEE',
                status: 'PENDING',
                dateOfBirth: '1990-01-01',
                gender: 'Male',
                registrationDate: new Date().toISOString()
              };
              console.log('Testing with registration:', testRegistration);
              setSelectedRegistration(testRegistration);
              setShowRegistrationApproval(true);
            }}
            style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              color: 'white', 
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            🧪 Test Modal
          </button>
          
          {/* Test Delete Button */}
          <button 
            onClick={() => {
              const testItem = {
                id: 999,
                name: 'Test User for Delete',
                email: 'test.delete@example.com'
              };
              console.log('Testing delete with item:', testItem);
              setItemToDelete({ item: testItem, type: 'user' });
              setShowDeleteModal(true);
            }}
            style={{ 
              background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
              color: 'white', 
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            🗑️ Test Delete
          </button>
          
          {/* Direct API Test Button */}
          <button 
            onClick={async () => {
              try {
                console.log('🧪 Testing API directly...');
                const testRegistration = {
                  id: 3,
                  name: 'vamsi',
                  email: 'mekavamsi0@gmail.com',
                  phoneNumber: '8909877890',
                  role: 'EMPLOYEE',
                  status: 'PENDING'
                };
                
                console.log('📞 Testing approveUser API...');
                const result = await superAdminAPI.approveUser(testRegistration.id, 'EMPLOYEE');
                console.log('✅ API Response:', result);
                alert('API test successful! Check console for details.');
              } catch (error) {
                console.error('❌ API Test failed:', error);
                alert('API test failed! Check console for error details.');
              }
            }}
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: 'white', 
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            🧪 Test API
          </button>
        </div>
      </div>

      <DataTable
        data={getFilteredRegistrations()}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phoneNumber', label: 'Phone' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'registrationDate', label: 'Registration Date' }
        ]}
        onView={handleViewRegistration}
        onEdit={(registration) => {
          console.log('Edit registration:', registration);
          // For now, just show the approval modal
          setSelectedRegistration(registration);
          setShowRegistrationApproval(true);
        }}
        onDelete={(registration) => handleDelete(registration, 'user')}
        showDelete={true}
        customActions={[
          {
            icon: '✅',
            label: 'Approve',
            className: 'primary',
            onClick: (registration) => {
              if (registration.status === 'PENDING') {
                setSelectedRegistration(registration);
                setShowRegistrationApproval(true);
              }
            },
            show: (registration) => registration.status === 'PENDING'
          }
        ]}
      />
    </div>
  );

  const renderFarmers = () => (
    <div className="dashboard-content">
      <div className="filters-section">
        <h3>Farmer Management</h3>
        <div className="filters">
          <select 
            value={filters.state} 
            onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
          >
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Punjab">Punjab</option>
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
        </div>
      </div>

      <DataTable
        data={getFilteredFarmers()}
        columns={[
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'contactNumber', label: 'Phone' },
          { key: 'state', label: 'State' },
          { key: 'district', label: 'District' },
          { key: 'kycStatus', label: 'KYC Status' },
          { key: 'status', label: 'Status' }
        ]}
        onView={handleViewFarmer}
        onEdit={(farmer) => {
          console.log('Edit farmer:', farmer);
          setShowFarmerForm(true);
        }}
        onDelete={(farmer) => handleDelete(farmer, 'farmer')}
        showDelete={true}
        customActions={[
          {
            icon: '📁',
            label: 'KYC Docs',
            className: 'secondary',
            onClick: handleKYCDocumentUpload
          }
        ]}
      />
    </div>
  );

  const renderEmployees = () => (
    <div className="dashboard-content">
      <div className="filters-section">
        <h3>Employee Management</h3>
        <div className="filters">
          <select 
            value={selectedEmployee} 
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees && employees.map(emp => (
              <option key={emp.id} value={emp.id}>{`${emp.firstName} ${emp.lastName}`}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        data={getFilteredEmployees()}
        columns={[
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'contactNumber', label: 'Phone' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' }
        ]}
        onView={handleViewEmployee}
        onEdit={(employee) => {
          setShowEmployeeForm(true);
          console.log('Edit employee:', employee);
        }}
        onDelete={(employee) => handleDelete(employee, 'employee')}
        showDelete={true}
      />
    </div>
  );

  const renderAuditTrail = () => (
    <div className="dashboard-content">
      <h3>Audit Trail - Deleted Records</h3>
      <div className="audit-table">
        <table>
          <thead>
            <tr>
              <th>Entity Type</th>
              <th>Entity Name</th>
              <th>Deleted By</th>
              <th>Deleted At</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {deletedRecords && deletedRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.entityType}</td>
                <td>{record.entityName}</td>
                <td>{record.deletedBy}</td>
                <td>{new Date(record.deletedAt).toLocaleDateString()}</td>
                <td>{record.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Super Admin Dashboard</h1>
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
        <button 
          className={`nav-btn ${currentView === 'registrations' ? 'active' : ''}`}
          onClick={() => setCurrentView('registrations')}
        >
          📋 Registrations
        </button>

        <button 
          className={`nav-btn ${currentView === 'audit' ? 'active' : ''}`}
          onClick={() => setCurrentView('audit')}
        >
          📋 Audit Trail
        </button>
      </div>

      <div className="dashboard-main">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'farmers' && renderFarmers()}
        {currentView === 'employees' && renderEmployees()}
        {currentView === 'registrations' && renderRegistrations()}

        {currentView === 'audit' && renderAuditTrail()}
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

      {showDeleteModal && (
        <DeleteModal
          item={itemToDelete?.item}
          type={itemToDelete?.type}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={confirmDelete}
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

      {showRegistrationApproval && (
        <RegistrationApprovalModal
          isOpen={showRegistrationApproval}
          onClose={() => {
            setShowRegistrationApproval(false);
            setSelectedRegistration(null);
          }}
          registration={selectedRegistration}
          onApprove={handleApproveRegistration}
          onReject={handleRejectRegistration}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard; 