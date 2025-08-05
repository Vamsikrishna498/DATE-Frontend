import React from 'react';
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm';

const EmployeeRegistration = () => {
  const handleSubmit = async (data) => {
    try {
      console.log('Employee registration submitted:', data);
      // The form component now handles the backend submission
      alert('Employee registration completed successfully!');
    } catch (error) {
      console.error('Error submitting employee registration:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <EmployeeRegistrationForm
      isInDashboard={false}
      onSubmit={handleSubmit}
    />
  );
};

export default EmployeeRegistration; 