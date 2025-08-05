import React from 'react';
import FarmerRegistrationForm from '../components/FarmerRegistrationForm';

const FarmerRegistration = () => {
  const handleSubmit = async (data) => {
    try {
      console.log('Farmer registration submitted:', data);
      // The form component now handles the backend submission
      alert('Farmer registration completed successfully!');
    } catch (error) {
      console.error('Error submitting farmer registration:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <FarmerRegistrationForm
      isInDashboard={false}
      onSubmit={handleSubmit}
    />
  );
};

export default FarmerRegistration; 