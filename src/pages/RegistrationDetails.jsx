import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/RegistrationDetails.css";

export const RegistrationDetails = () => {
  const { id } = useParams();
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
      // Update local state
      setRegistration((prev) => ({
        ...prev,
        status: newStatus,
      }));
      setNewStatus("");
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (!registration) return <div className="details-container">Loading...</div>;

  return (
    <div className="details-container">
      <h2>Registration Details</h2>
      <div className="details-card">
        <div className="photo-section">
          <img
            src={registration.photoUrl || "/default-photo.jpg"}
            alt={registration.name}
            className="profile-photo"
          />
        </div>
        <div className="info-section">
          <p><strong>Title:</strong> {registration.title}</p>
          <p><strong>First Name:</strong> {registration.firstName}</p>
          <p><strong>Last Name:</strong> {registration.lastName}</p>
          <p><strong>DOB:</strong> {registration.dateOfBirth}</p>
          <p><strong>Gender:</strong> {registration.gender}</p>
          <p><strong>Email:</strong> {registration.email}</p>
          <p><strong>Mobile:</strong> {registration.mobileNumber}</p>
          <p><strong>Country:</strong> {registration.country}</p>
          <p><strong>State:</strong> {registration.state}</p>
          <p><strong>District:</strong> {registration.district}</p>
          <p><strong>City:</strong> {registration.city}</p>
          <p><strong>Zip Code:</strong> {registration.zipCode}</p>
        </div>
      </div>

      <div className="status-section">
        <p>
          <strong>Current Status:</strong>
          <span className={`status ${registration.status.toLowerCase()}`}>
            {registration.status}
          </span>
        </p>

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Select Action</option>
          <option value="Approved">Approve</option>
          <option value="Rejected">Reject</option>
          <option value="Return">Refer Back</option>
        </select>

        <button
          disabled={!newStatus}
          onClick={handleStatusUpdate}
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default RegistrationDetails;
