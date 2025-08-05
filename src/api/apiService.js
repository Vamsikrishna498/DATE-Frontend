import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // Use relative URL since we have proxy configured
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    if (error.response?.status === 401 && token) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Register user with role
  registerWithRole: async (userData) => {
    const response = await api.post('/auth/register-simple', userData);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Send OTP
  sendOTP: async (emailOrPhone) => {
    const response = await api.post('/auth/send-otp', { emailOrPhone });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post('/auth/verify-otp', otpData);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (emailOrPhone) => {
    const response = await api.post('/auth/forgot-password', { emailOrPhone });
    return response.data;
  },

  // Forgot user ID
  forgotUserId: async (emailOrPhone) => {
    const response = await api.post('/auth/forgot-user-id', { emailOrPhone });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Force change password (for first-time login)
  forceChangePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Change user ID
  changeUserId: async (userIdData) => {
    const response = await api.post('/auth/change-user-id', userIdData);
    return response.data;
  },

  // Get countries
  getCountries: async () => {
    const response = await api.get('/auth/countries');
    return response.data;
  },

  // Get states
  getStates: async (countryId) => {
    const response = await api.post('/auth/states', { countryId });
    return response.data;
  },

  // Generate captcha
  generateCaptcha: async () => {
    const response = await api.get('/auth/captcha');
    return response.data;
  },

  // Verify captcha
  verifyCaptcha: async (captcha) => {
    const response = await api.post('/captcha/verify', { captcha });
    return response.data;
  },

  // Approve user registration
  approveUser: async (userId, role) => {
    const response = await api.put(`/auth/users/${userId}/approve`, { role });
    return response.data;
  },

  // Test endpoint
  testConnection: async () => {
    const response = await api.get('/auth/test');
    return response.data;
  }
};

// Farmers API calls
export const farmersAPI = {
  // Get all farmers
  getAllFarmers: async (filters = {}) => {
    const response = await api.get('/farmers', { params: filters });
    return response.data;
  },

  // Get farmer by ID
  getFarmerById: async (id) => {
    const response = await api.get(`/farmers/${id}`);
    return response.data;
  },

  // Create farmer
  createFarmer: async (farmerData) => {
    const response = await api.post('/farmers', farmerData);
    return response.data;
  },

  // Update farmer
  updateFarmer: async (id, farmerData) => {
    const response = await api.put(`/farmers/${id}`, farmerData);
    return response.data;
  },

  // Delete farmer
  deleteFarmer: async (id) => {
    const response = await api.delete(`/farmers/${id}`);
    return response.data;
  },

  // Assign farmer to employee
  assignFarmer: async (farmerId, employeeId) => {
    const response = await api.post(`/farmers/${farmerId}/assign`, { employeeId });
    return response.data;
  },

  // Get farmer statistics
  getFarmerStats: async () => {
    const response = await api.get('/farmers/stats');
    return response.data;
  }
};

// Employees API calls
export const employeesAPI = {
  // Get all employees
  getAllEmployees: async (filters = {}) => {
    const response = await api.get('/employees', { params: filters });
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get assigned farmers for employee
  getAssignedFarmers: async (employeeId) => {
    const response = await api.get(`/employees/${employeeId}/assigned-farmers`);
    return response.data;
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },

  // Get address by pincode
  getAddressByPincode: async (pincode) => {
    const response = await api.get(`/employees/address-by-pincode/${pincode}`);
    return response.data;
  },

  // Give login access to employee
  giveLoginAccess: async (employeeId) => {
    const response = await api.post(`/employees/${employeeId}/give-login-access`);
    return response.data;
  }
};

// Registrations API calls
export const registrationsAPI = {
  // Get all registrations
  getAllRegistrations: async (filters = {}) => {
    const response = await api.get('/registrations', { params: filters });
    return response.data;
  },

  // Get registration by ID
  getRegistrationById: async (id) => {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
  },

  // Approve registration
  approveRegistration: async (id, approvalData) => {
    const response = await api.post(`/registrations/${id}/approve`, approvalData);
    return response.data;
  },

  // Reject registration
  rejectRegistration: async (id, rejectionData) => {
    const response = await api.post(`/registrations/${id}/reject`, rejectionData);
    return response.data;
  },

  // Get registration statistics
  getRegistrationStats: async () => {
    const response = await api.get('/registrations/stats');
    return response.data;
  }
};

// KYC API calls
export const kycAPI = {
  // Upload KYC documents
  uploadDocuments: async (farmerId, documents) => {
    const formData = new FormData();
    Object.keys(documents).forEach(key => {
      if (documents[key]) {
        formData.append(key, documents[key]);
      }
    });
    
    const response = await api.post(`/kyc/${farmerId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Approve KYC
  approveKYC: async (farmerId, approvalData) => {
    const response = await api.post(`/kyc/${farmerId}/approve`, approvalData);
    return response.data;
  },

  // Reject KYC
  rejectKYC: async (farmerId, rejectionData) => {
    const response = await api.post(`/kyc/${farmerId}/reject`, rejectionData);
    return response.data;
  },

  // Refer back KYC
  referBackKYC: async (farmerId, referBackData) => {
    const response = await api.post(`/kyc/${farmerId}/refer-back`, referBackData);
    return response.data;
  },

  // Get KYC status
  getKYCStatus: async (farmerId) => {
    const response = await api.get(`/kyc/${farmerId}/status`);
    return response.data;
  },

  // Get KYC documents
  getKYCDocuments: async (farmerId) => {
    const response = await api.get(`/kyc/${farmerId}/documents`);
    return response.data;
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get admin dashboard statistics
  getAdminDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  // Get farmers with KYC status
  getFarmersWithKyc: async () => {
    const response = await api.get('/admin/farmers-with-kyc');
    return response.data;
  },

  // Get employees with statistics
  getEmployeesWithStats: async () => {
    const response = await api.get('/admin/employees-with-stats');
    return response.data;
  },

  // Get farmers by employee
  getFarmersByEmployee: async (employeeId) => {
    const response = await api.get(`/admin/employees/${employeeId}/assigned-farmers`);
    return response.data;
  },

  // Filter farmers
  filterFarmers: async (filters = {}) => {
    const response = await api.get('/admin/farmers/filter', { params: filters });
    return response.data;
  },

  // Get locations for filters
  getLocations: async () => {
    const response = await api.get('/admin/locations');
    return response.data;
  },

  // Get admin todo list
  getAdminTodoList: async () => {
    const response = await api.get('/admin/todo-list');
    return response.data;
  },

  // Get all farmers (raw data)
  getAllFarmers: async () => {
    const response = await api.get('/admin/farmers');
    return response.data;
  },

  // Get all employees (raw data)
  getAllEmployees: async () => {
    const response = await api.get('/admin/employees');
    return response.data;
  },

  // Assign farmer to employee
  assignFarmerToEmployee: async (farmerId, employeeId) => {
    const response = await api.post(`/admin/assign-farmer?farmerId=${farmerId}&employeeId=${employeeId}`);
    return response.data;
  },

  // Legacy endpoints for backward compatibility
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getAdminDashboardData: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getSuperAdminDashboardData: async () => {
    const response = await api.get('/dashboard/super-admin');
    return response.data;
  },

  getEmployeeDashboardData: async (employeeId) => {
    const response = await api.get(`/dashboard/employee/${employeeId}`);
    return response.data;
  }
};

// Super Admin API calls
export const superAdminAPI = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get('/super-admin/dashboard/stats');
    return response.data;
  },

  // Employee Statistics
  getEmployeeStats: async () => {
    const response = await api.get('/super-admin/dashboard/employee-stats');
    return response.data;
  },

  // To-Do Items
  getTodoItems: async () => {
    const response = await api.get('/super-admin/dashboard/todo');
    return response.data;
  },

  // Registration Management
  getAllRegistrations: async () => {
    const response = await api.get('/super-admin/registration-list');
    return response.data;
  },

  filterRegistrations: async (status = 'ALL') => {
    const response = await api.get(`/super-admin/registration-list/filter?status=${status}`);
    return response.data;
  },

  searchRegistrations: async (query) => {
    const response = await api.get(`/super-admin/registration-list/search?query=${query}`);
    return response.data;
  },

  getPendingRegistrations: async () => {
    const response = await api.get('/super-admin/pending-registrations');
    return response.data;
  },

  getApprovedUsers: async () => {
    const response = await api.get('/super-admin/approved-users');
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await api.get(`/super-admin/users/by-role/${role}`);
    return response.data;
  },

  getPendingUsersByRole: async (role) => {
    const response = await api.get(`/super-admin/pending-users/by-role/${role}`);
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await api.get('/super-admin/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/super-admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/super-admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/super-admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/super-admin/users/${id}`);
    return response.data;
  },

  bulkDeleteUsers: async (userIds) => {
    const response = await api.delete('/super-admin/users/bulk', { data: userIds });
    return response.data;
  },

  // Farmer Management
  getAllFarmers: async () => {
    const response = await api.get('/super-admin/farmers');
    return response.data;
  },

  getFarmerById: async (id) => {
    const response = await api.get(`/super-admin/farmers/${id}`);
    return response.data;
  },

  createFarmer: async (farmerData) => {
    const response = await api.post('/super-admin/farmers', farmerData);
    return response.data;
  },

  updateFarmer: async (id, farmerData) => {
    const response = await api.put(`/super-admin/farmers/${id}`, farmerData);
    return response.data;
  },

  deleteFarmer: async (id) => {
    const response = await api.delete(`/super-admin/farmers/${id}`);
    return response.data;
  },

  // Employee Management
  getAllEmployees: async () => {
    const response = await api.get('/super-admin/employees');
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/super-admin/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post('/super-admin/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/super-admin/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/super-admin/employees/${id}`);
    return response.data;
  },

  // Registration Approval Actions
  approveUser: async (id, role) => {
    const response = await api.put(`/auth/users/${id}/approve`, { role });
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.put(`/auth/users/${id}/status`, { status });
    return response.data;
  }
};

// Employee Dashboard API calls
export const employeeDashboardAPI = {
  // Get employee dashboard data
  getDashboardData: async (employeeId) => {
    const response = await api.get(`/employee/dashboard/${employeeId}`);
    return response.data;
  },

  // Get assigned farmers for employee
  getAssignedFarmers: async (employeeId) => {
    const response = await api.get(`/employee/${employeeId}/assigned-farmers`);
    return response.data;
  },

  // Get employee statistics
  getEmployeeStats: async (employeeId) => {
    const response = await api.get(`/employee/${employeeId}/stats`);
    return response.data;
  },

  // Get KYC cases for employee
  getKYCCases: async (employeeId, filters = {}) => {
    const response = await api.get(`/employee/${employeeId}/kyc-cases`, { params: filters });
    return response.data;
  },

  // Update KYC status
  updateKYCStatus: async (farmerId, status, reason = '') => {
    const response = await api.put(`/employee/kyc/${farmerId}/status`, { status, reason });
    return response.data;
  },

  // Get farmer details for KYC review
  getFarmerDetails: async (farmerId) => {
    const response = await api.get(`/employee/farmers/${farmerId}`);
    return response.data;
  },

  // Get employee's own profile
  getEmployeeProfile: async (employeeId) => {
    const response = await api.get(`/employee/${employeeId}/profile`);
    return response.data;
  },

  // Update employee's own profile
  updateEmployeeProfile: async (employeeId, profileData) => {
    const response = await api.put(`/employee/${employeeId}/profile`, profileData);
    return response.data;
  },

  // Get todo items for employee
  getTodoItems: async (employeeId) => {
    const response = await api.get(`/employee/${employeeId}/todo`);
    return response.data;
  },

  // Mark todo item as completed
  markTodoComplete: async (employeeId, todoId) => {
    const response = await api.put(`/employee/${employeeId}/todo/${todoId}/complete`);
    return response.data;
  }
};

// Additional utility functions
export const getUserProfile = async () => {
  return api.get('/user/profile'); // Adjust endpoint if needed
};

export const refreshToken = async () => {
  return api.post('/auth/refresh'); // If your backend supports token refresh
};

export default api;
