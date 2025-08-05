import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { employeeDashboardAPI } from '../api/apiService';
import '../styles/Dashboard.css';
import FarmerForm from '../components/FarmerForm';
import KYCModal from '../components/KYCModal';

import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';
import StatsCard from '../components/StatsCard';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [assignedFarmers, setAssignedFarmers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAssigned: 0,
    approved: 0,
    pending: 0,
    referBack: 0,
    rejected: 0
  });
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);

  const [filters, setFilters] = useState({
    kycStatus: '',
    assignedDate: ''
  });

  // Load employee dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading Employee Dashboard data for employee ID:', user.id);
        
        // Load assigned farmers
        const farmersResponse = await employeeDashboardAPI.getAssignedFarmers(user.id);
        console.log('📋 Assigned farmers loaded:', farmersResponse);
        setAssignedFarmers(farmersResponse.farmers || farmersResponse || []);
        
        // Load employee statistics
        const statsResponse = await employeeDashboardAPI.getEmployeeStats(user.id);
        console.log('📊 Employee stats loaded:', statsResponse);
        setDashboardStats(statsResponse.stats || statsResponse || {
          totalAssigned: 0,
          approved: 0,
          pending: 0,
          referBack: 0,
          rejected: 0
        });
        
        // Load todo items
        const todoResponse = await employeeDashboardAPI.getTodoItems(user.id);
        console.log('📝 Todo items loaded:', todoResponse);
        setTodoItems(todoResponse.todos || todoResponse || []);
        
      } catch (error) {
        console.error('❌ Error loading Employee Dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // Fallback to mock data for development
        const mockAssignedFarmers = [
          {
            id: 1,
            name: 'Rajesh Kumar',
            phone: '9876543210',
            state: 'Maharashtra',
            district: 'Pune',
            assignedDate: '2024-01-15',
            kycStatus: 'APPROVED',
            location: 'Pune, Maharashtra',
            lastAction: '2024-01-20',
            notes: 'All documents verified'
          },
          {
            id: 2,
            name: 'Suresh Patel',
            phone: '9876543211',
            state: 'Gujarat',
            district: 'Ahmedabad',
            assignedDate: '2024-01-18',
            kycStatus: 'PENDING',
            location: 'Ahmedabad, Gujarat',
            lastAction: '2024-01-22',
            notes: 'Documents pending verification'
          }
        ];
        
        setAssignedFarmers(mockAssignedFarmers);
        setDashboardStats({
          totalAssigned: mockAssignedFarmers.length,
          approved: mockAssignedFarmers.filter(f => f.kycStatus === 'APPROVED').length,
          pending: mockAssignedFarmers.filter(f => f.kycStatus === 'PENDING').length,
          referBack: mockAssignedFarmers.filter(f => f.kycStatus === 'REFER_BACK').length,
          rejected: mockAssignedFarmers.filter(f => f.kycStatus === 'REJECTED').length
        });
        setTodoItems([
          { id: 1, title: 'Review pending KYC cases', priority: 'high', completed: false },
          { id: 2, title: 'Follow up on referred back cases', priority: 'medium', completed: false }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const getFilteredFarmers = () => {
    return assignedFarmers.filter(farmer => {
      const matchesKycStatus = !filters.kycStatus || farmer.kycStatus === filters.kycStatus;
      const matchesAssignedDate = !filters.assignedDate || farmer.assignedDate === filters.assignedDate;
      
      return matchesKycStatus && matchesAssignedDate;
    });
  };

  const handleKYCUpdate = async (farmerId, newStatus, reason) => {
    try {
      console.log('🔄 Updating KYC status for farmer:', farmerId, 'to:', newStatus);
      
      const result = await employeeDashboardAPI.updateKYCStatus(farmerId, newStatus, reason);
      console.log('✅ KYC status updated successfully:', result);
      
      // Find the farmer to get the old status
      const farmerToUpdate = assignedFarmers.find(farmer => farmer.id === farmerId);
      const oldStatus = farmerToUpdate?.kycStatus;
      
      // Update local state
      setAssignedFarmers(prev => prev.map(farmer => {
        if (farmer.id === farmerId) {
          return {
            ...farmer,
            kycStatus: newStatus,
            lastAction: new Date().toISOString().split('T')[0],
            notes: reason || farmer.notes
          };
        }
        return farmer;
      }));
      
      // Update dashboard stats
      setDashboardStats(prev => {
        const newStats = { ...prev };
        // Decrease old status count
        if (oldStatus === 'APPROVED') newStats.approved--;
        else if (oldStatus === 'PENDING') newStats.pending--;
        else if (oldStatus === 'REFER_BACK') newStats.referBack--;
        else if (oldStatus === 'REJECTED') newStats.rejected--;
        
        // Increase new status count
        if (newStatus === 'APPROVED') newStats.approved++;
        else if (newStatus === 'PENDING') newStats.pending++;
        else if (newStatus === 'REFER_BACK') newStats.referBack++;
        else if (newStatus === 'REJECTED') newStats.rejected++;
        
        return newStats;
      });
      
      alert(`KYC status updated to ${newStatus} successfully!`);
      
    } catch (error) {
      console.error('❌ Error updating KYC status:', error);
      alert(`Failed to update KYC status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewFarmer = async (farmer) => {
    try {
      console.log('🔄 Loading farmer details for:', farmer.id);
      
      const farmerDetails = await employeeDashboardAPI.getFarmerDetails(farmer.id);
      console.log('📋 Farmer details loaded:', farmerDetails);
      
      setSelectedFarmerData(farmerDetails);
      setShowFarmerDetails(true);
      
    } catch (error) {
      console.error('❌ Error loading farmer details:', error);
      alert('Failed to load farmer details. Please try again.');
    }
  };

  const handleCloseFarmerDetails = () => {
    setShowFarmerDetails(false);
    setSelectedFarmerData(null);
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };

  const handleUpdateEmployee = async (updatedData) => {
    try {
      console.log('🔄 Updating employee profile:', updatedData);
      
      const result = await employeeDashboardAPI.updateEmployeeProfile(user.id, updatedData);
      console.log('✅ Employee profile updated successfully:', result);
      
      setShowEmployeeDetails(false);
      setSelectedEmployeeData(null);
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('❌ Error updating employee profile:', error);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleMarkTodoComplete = async (todoId) => {
    try {
      console.log('🔄 Marking todo as complete:', todoId);
      
      const result = await employeeDashboardAPI.markTodoComplete(user.id, todoId);
      console.log('✅ Todo marked as complete:', result);
      
      // Update local state
      setTodoItems(prev => prev.map(todo => 
        todo.id === todoId ? { ...todo, completed: true } : todo
      ));
      
    } catch (error) {
      console.error('❌ Error marking todo as complete:', error);
      alert(`Failed to mark todo as complete: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Assigned"
              value={dashboardStats.totalAssigned}
              icon="📋"
              color="blue"
            />
            <StatsCard
              title="Approved"
              value={dashboardStats.approved}
              icon="✅"
              color="green"
            />
            <StatsCard
              title="Pending"
              value={dashboardStats.pending}
              icon="⏳"
              color="orange"
            />
            <StatsCard
              title="Refer Back"
              value={dashboardStats.referBack}
              icon="🔄"
              color="yellow"
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
                className="action-btn secondary"
                onClick={() => setCurrentView('assigned')}
              >
                📋 View Assigned Farmers
              </button>
            </div>
          </div>

          <div className="todo-panel">
            <h3>To-Do List</h3>
            <div className="todo-items">
              {todoItems.length > 0 ? (
                todoItems.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <span className="todo-icon">⏳</span>
                    <span className="todo-text">{todo.title}</span>
                    {!todo.completed && (
                      <button 
                        className="complete-btn"
                        onClick={() => handleMarkTodoComplete(todo.id)}
                      >
                        ✓
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-todos">No pending tasks</p>
              )}
              
              {dashboardStats.pending > 0 && (
                <div className="todo-item">
                  <span className="todo-icon">⏳</span>
                  <span>{dashboardStats.pending} KYC cases pending review</span>
                </div>
              )}
              {dashboardStats.referBack > 0 && (
                <div className="todo-item">
                  <span className="todo-icon">🔄</span>
                  <span>{dashboardStats.referBack} cases need follow-up</span>
                </div>
              )}
              {assignedFarmers.filter(f => {
                const assignedDate = new Date(f.assignedDate);
                const daysDiff = (new Date() - assignedDate) / (1000 * 60 * 60 * 24);
                return daysDiff > 7 && f.kycStatus === 'PENDING';
              }).length > 0 && (
                <div className="todo-item">
                  <span className="todo-icon">⚠️</span>
                  <span>Some KYC cases are overdue</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderAssignedFarmers = () => (
    <div className="dashboard-content">
      <div className="filters-section">
        <h3>Assigned Farmers</h3>
        <div className="filters">
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
            value={filters.assignedDate} 
            onChange={(e) => setFilters(prev => ({ ...prev, assignedDate: e.target.value }))}
          >
            <option value="">All Dates</option>
            {Array.from(new Set(assignedFarmers.map(f => f.assignedDate))).map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading assigned farmers...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <div className="farmers-grid">
          {getFilteredFarmers().length > 0 ? (
            getFilteredFarmers().map(farmer => (
              <div key={farmer.id} className="farmer-card">
                <div className="farmer-header">
                  <h4>{farmer.name}</h4>
                  <span className={`status-badge ${farmer.kycStatus.toLowerCase()}`}>
                    {farmer.kycStatus}
                  </span>
                </div>
                <div className="farmer-details">
                  <p><strong>Phone:</strong> {farmer.phone}</p>
                  <p><strong>Location:</strong> {farmer.location}</p>
                  <p><strong>Assigned Date:</strong> {farmer.assignedDate}</p>
                  <p><strong>Last Action:</strong> {farmer.lastAction}</p>
                  {farmer.notes && (
                    <p><strong>Notes:</strong> {farmer.notes}</p>
                  )}
                </div>
                <div className="farmer-actions">
                  <button 
                    className="action-btn-small primary"
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setShowKYCModal(true);
                    }}
                  >
                    Review KYC
                  </button>
                  
                  <button 
                    className="action-btn-small info"
                    onClick={() => handleViewFarmer(farmer)}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No farmers found with the selected filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderKYCProgress = () => (
    <div className="dashboard-content">
      <h3>KYC Progress Summary</h3>
      <div className="kyc-progress">
        <div className="progress-item">
          <div className="progress-label">Approved</div>
          <div className="progress-bar">
            <div 
              className="progress-fill approved" 
              style={{ width: `${dashboardStats.totalAssigned > 0 ? (dashboardStats.approved / dashboardStats.totalAssigned) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="progress-value">{dashboardStats.approved}</div>
        </div>
        <div className="progress-item">
          <div className="progress-label">Pending</div>
          <div className="progress-bar">
            <div 
              className="progress-fill pending" 
              style={{ width: `${dashboardStats.totalAssigned > 0 ? (dashboardStats.pending / dashboardStats.totalAssigned) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="progress-value">{dashboardStats.pending}</div>
        </div>
        <div className="progress-item">
          <div className="progress-label">Refer Back</div>
          <div className="progress-bar">
            <div 
              className="progress-fill refer-back" 
              style={{ width: `${dashboardStats.totalAssigned > 0 ? (dashboardStats.referBack / dashboardStats.totalAssigned) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="progress-value">{dashboardStats.referBack}</div>
        </div>
        <div className="progress-item">
          <div className="progress-label">Rejected</div>
          <div className="progress-bar">
            <div 
              className="progress-fill rejected" 
              style={{ width: `${dashboardStats.totalAssigned > 0 ? (dashboardStats.rejected / dashboardStats.totalAssigned) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="progress-value">{dashboardStats.rejected}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Employee Dashboard</h1>
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
          className={`nav-btn ${currentView === 'assigned' ? 'active' : ''}`}
          onClick={() => setCurrentView('assigned')}
        >
          👨‍🌾 Assigned Farmers
        </button>
        <button 
          className={`nav-btn ${currentView === 'progress' ? 'active' : ''}`}
          onClick={() => setCurrentView('progress')}
        >
          📈 KYC Progress
        </button>
      </div>

      <div className="dashboard-main">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'assigned' && renderAssignedFarmers()}
        {currentView === 'progress' && renderKYCProgress()}
      </div>

      {showFarmerForm && (
        <FarmerForm 
          onClose={() => setShowFarmerForm(false)}
          onSubmit={async (farmerData) => {
            try {
              // In a real implementation, this would call an API to add a farmer
              console.log('🔄 Adding new farmer:', farmerData);
              
              // For now, just add to local state
              const newFarmer = {
                ...farmerData,
                id: Date.now(),
                assignedDate: new Date().toISOString().split('T')[0],
                kycStatus: 'PENDING',
                lastAction: new Date().toISOString().split('T')[0]
              };
              
              setAssignedFarmers(prev => [...prev, newFarmer]);
              setShowFarmerForm(false);
              alert('Farmer added successfully!');
              
            } catch (error) {
              console.error('❌ Error adding farmer:', error);
              alert('Failed to add farmer. Please try again.');
            }
          }}
        />
      )}

      {showKYCModal && selectedFarmer && (
        <KYCModal
          farmer={selectedFarmer}
          onClose={() => {
            setShowKYCModal(false);
            setSelectedFarmer(null);
          }}
          onSubmit={handleKYCUpdate}
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
    </div>
  );
};

export default EmployeeDashboard; 