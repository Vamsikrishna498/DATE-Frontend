import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegistrationDetails } from "./RegistrationDetails";
import "../styles/List.css";
 
// ------------------ Registration List ------------------
export const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/users/all", {
          params: {
            role: "Farmer",
            status: "Active",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegistrations(response.data);
      } catch (error) {
        console.error("Error fetching registrations", error);
      }
    };
 
    if (token) {
      fetchRegistrations();
    }
  }, [token]);

  const handleStatusChange = (id, newStatus) => {
  setRegistrations((prev) =>
    prev.map((reg) =>
      reg.id === id ? { ...reg, status: newStatus } : reg
    )
  );
};
 
  return (
    <div className="list-container">
      {!selectedId && (
        <>
      <h3>Registration List</h3>
      {registrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        <table className="registration-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Date of Birth</th>
              <th>City</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id}>
                <td>{r.name || r.userName}</td>
                <td>{r.email}</td>
                <td>{r.mobileNumber || "N/A"}</td>
                <td>{r.dateOfBirth || "N/A"}</td>
                <td>{r.city || "N/A"}</td>
                <td>{r.role}</td>
                
                <td>
                  <select className="reg-selact"
                    value={r.status || ""}
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Return">Return</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => setSelectedId(r.id)}>View</button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
      
        </>
      )}
      {selectedId && (
        <RegistrationDetails
          id={selectedId}
          onBack={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};
 
// ------------------ Farmer List ------------------
 export const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const navigate = useNavigate();
  const { farmerId } = useParams();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { reset } = useForm();

  // ✅ Fetch all farmers list
  const fetchAllFarmers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:8080/api/farmers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFarmers(res.data || []);
    } catch (err) {
      console.error("Error fetching farmers:", err);
      alert("Failed to fetch farmers.");
    }
  };

  // ✅ Fetch single farmer if farmerId is in URL
  const fetchFarmerData = async () => {
    if (!farmerId || farmerId === "undefined") {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/farmers/${farmerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      reset(res.data);
      if (res.data.photo) {
        setPhotoPreview(res.data.photo);
      }
    } catch (err) {
      console.error("Error fetching farmer data:", err);
      alert("Failed to fetch farmer data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ On mount, fetch the list
  useEffect(() => {
    fetchAllFarmers();
  }, []);

  // ✅ If editing a farmer
  useEffect(() => {
    if (farmerId) {
      fetchFarmerData();
    }
  }, [farmerId]);

  // ✅ Update status locally
  const handleStatusChange = (id, newStatus) => {
    const updatedFarmers = farmers.map((f) =>
      f.id === id ? { ...f, status: newStatus } : f
    );
    setFarmers(updatedFarmers);
  };

  // ✅ Mask Aadhaar
  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return "";
    return `****-***-${aadhaar.slice(-4)}`;
  };

  // ✅ Show loading state
  if (loading) return <p>Loading farmer data...</p>;

  return (
    <div className="list-container">
      <h3>Farmers List</h3>
      <table className="farmer-table">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Name</th>
            <th>Document</th>
            <th>State</th>
            <th>District</th>
            <th>Mandal</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((f) => (
            <tr key={f.id}>
              <td>
                <span className="farmer-id">{f.id}</span>
              </td>
              <td>
                {f.name?.trim() ||
                  `${f.firstName || ""} ${f.lastName || ""}`.trim()}
              </td>
              <td>
                {f.documentType?.toLowerCase() === "aadhaar" && f.documentNumber
                  ? maskAadhaar(f.documentNumber)
                  : f.documentType || "-"}
              </td>
              <td>{f.state || "-"}</td>
              <td>{f.district || "-"}</td>
              <td>{f.block || "-"}</td>
              <td>
                <select
                  className="reg-selact"
                  value={f.status || ""}
                  onChange={(e) => handleStatusChange(f.id, e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="Approved">Approved</option>
                  <option value="Return">Return</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
              <td>
                <button
                  className="view-button"
                  onClick={() => navigate(`/view-farmer/${f.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
 
// ------------------ Employee List ------------------
export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);
 
  return (
    <div className="list-container">
      <h3>Employees List</h3>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>District</th>
            <th>Contact Number</th>
            <th>Onboard Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td><span className="employee-id">{e.employeeId}</span></td>
              <td>{e.name}</td>
              <td>{e.designation}</td>
              <td>{e.district}</td>
              <td>{e.contactNumber}</td>
              <td>{e.onboardDate}</td>
              <td>
                {e.status === "Active" && <span className="status active">Active</span>}
                {e.status === "Inactive" && <span className="status inactive">Inactive</span>}
              </td>
              <td>
                <button className="view-button">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
 
 