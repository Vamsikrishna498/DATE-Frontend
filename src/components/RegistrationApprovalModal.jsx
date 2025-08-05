import React, { useState } from 'react';

const RegistrationApprovalModal = ({ 
  isOpen, 
  onClose, 
  registration, 
  onApprove, 
  onReject 
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRole, setSelectedRole] = useState(registration?.role || 'FARMER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !registration) return null;

  console.log('🔍 Modal Debug - Registration:', registration);
  console.log('🔍 Modal Debug - Status:', registration.status);
  console.log('🔍 Modal Debug - Role:', registration.role);

  const handleApprove = async () => {
    console.log('✅ APPROVE BUTTON CLICKED');
    console.log('📋 Registration ID:', registration.id);
    console.log('👤 Selected Role:', selectedRole);
    console.log('📊 Current Status:', registration.status);
    
    setIsSubmitting(true);
    try {
      await onApprove(registration.id, selectedRole);
      console.log('✅ Approval successful');
      onClose();
    } catch (error) {
      console.error('❌ Approval failed:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to approve registration: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    console.log('❌ REJECT BUTTON CLICKED');
    console.log('📋 Registration ID:', registration.id);
    console.log('📝 Rejection Reason:', rejectionReason);
    
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(registration.id, rejectionReason);
      console.log('✅ Rejection successful');
      onClose();
    } catch (error) {
      console.error('❌ Rejection failed:', error);
      alert('Failed to reject registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Registration Approval</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Registration Info */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>Registration Information</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>ID:</strong>
              <span>{registration.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Name:</strong>
              <span>{registration.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Email:</strong>
              <span>{registration.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Phone:</strong>
              <span>{registration.phoneNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Role:</strong>
              <span style={{
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {registration.role}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Status:</strong>
              <span style={{
                padding: '4px 8px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {registration.status}
              </span>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px',
          border: '2px solid #d1d5db'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>🔍 Debug Information</h4>
          <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Status:</strong> {registration.status}</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Role:</strong> {registration.role}</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Is PENDING:</strong> {registration.status === 'PENDING' ? 'YES' : 'NO'}</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Registration ID:</strong> {registration.id}</p>
        </div>

        {/* Approval Actions - ALWAYS VISIBLE */}
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#ecfdf5',
          border: '3px solid #10b981',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#065f46', textAlign: 'center' }}>
            🎯 APPROVAL ACTIONS
          </h3>
          
          {/* Status Indicator */}
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: registration.status === 'PENDING' ? '#fef3c7' : '#dbeafe',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <strong style={{ color: registration.status === 'PENDING' ? '#d97706' : '#1d4ed8' }}>
              Current Status: {registration.status}
            </strong>
            <br />
            <small style={{ color: '#6b7280' }}>
              {registration.status === 'PENDING' 
                ? 'This user can be approved with role assignment'
                : registration.status === 'APPROVED'
                ? 'This user is already approved'
                : 'This user can be updated to approved status'
              }
            </small>
          </div>
          
          {/* Role Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>
              Assign Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isSubmitting || registration.status === 'APPROVED'}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                opacity: registration.status === 'APPROVED' ? 0.6 : 1
              }}
            >
              <option value="FARMER">Farmer</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button 
              onClick={handleApprove}
              disabled={isSubmitting || registration.status === 'APPROVED'}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: registration.status === 'APPROVED' ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: (isSubmitting || registration.status === 'APPROVED') ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || registration.status === 'APPROVED') ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Processing...' : 
               registration.status === 'APPROVED' ? 'Already Approved' : 
               '✅ Approve Registration'}
            </button>
            <button 
              onClick={() => document.getElementById('rejection-reason').focus()}
              disabled={isSubmitting || registration.status === 'REJECTED'}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: registration.status === 'REJECTED' ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: (isSubmitting || registration.status === 'REJECTED') ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || registration.status === 'REJECTED') ? 0.6 : 1
              }}
            >
              {registration.status === 'REJECTED' ? 'Already Rejected' : '❌ Reject Registration'}
            </button>
          </div>

          {/* Rejection Reason */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>
              Rejection Reason (Required for rejection):
            </label>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            />
            <button 
              onClick={handleReject}
              disabled={isSubmitting || !rejectionReason.trim()}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: (isSubmitting || !rejectionReason.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || !rejectionReason.trim()) ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationApprovalModal; 