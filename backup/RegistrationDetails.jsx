import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RegistrationDetails.css";

const RegistrationDetails = ({ id, onClose, onStatusChange }) => {
  const [registration, setRegistration] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchRegistration = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegistration(res.data);
      } catch (error) {
        console.error("Error fetching registration details", error);
      }
    };
    fetchRegistration();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/auth/users/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Status updated successfully");
      onStatusChange(); // ✅ refresh list
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (!registration) return null;

  return (
    <div className="details-panel">
      <h2>Registration Details</h2>
      <img src="/default-photo.jpg" alt="User" className="profile-photo" />
      <p><strong>First Name:</strong> {registration.firstName}</p>
      <p><strong>Last Name:</strong> {registration.lastName}</p>
      <p><strong>Email:</strong> {registration.email}</p>
      <p><strong>Mobile:</strong> {registration.mobileNumber}</p>
      <p><strong>Date of Birth:</strong> {registration.dateOfBirth}</p>
      <p><strong>City:</strong> {registration.city}</p>
      <p><strong>Role:</strong> {registration.role}</p>
      <p><strong>Status:</strong> {registration.status}</p>

      <div className="status-section">
        <label>
          Current Status:
          <span className={`status ${registration.status?.toLowerCase()}`}>
            {registration.status}
          </span>
        </label>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="">Select</option>
          <option value="Approved">Approve</option>
          <option value="Rejected">Reject</option>
          <option value="Refer Back">Refer Back</option>
        </select>
        <div className="btn-group">
          <button onClick={handleStatusUpdate}>Update</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetails;
