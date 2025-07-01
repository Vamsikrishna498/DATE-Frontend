import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/List.css";

// Registration List
export const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegistrations(res.data);
      } catch (error) {
        console.error("Error fetching registrations", error);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="list-container">
      <h3>Registration List</h3>
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
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.mobileNumber}</td>
              <td>{r.dateOfBirth}</td>
              <td>{r.city}</td>
              <td>{r.role}</td>
              <td>
                {r.status === "Active" && (
                  <span className="status active">Active</span>
                )}
                {r.status === "Inactive" && (
                  <span className="status inactive">Inactive</span>
                )}
                {r.status === "Pending" && (
                  <span className="status pending">Pending</span>
                )}
                {r.status === "Rejected" && (
                  <span className="status rejected">Rejected</span>
                )}
                {r.status === "Return" && (
                  <span className="status return">Return</span>
                )}
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

// Farmer List
export const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/farmers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmers(res.data);
      } catch (error) {
        console.error("Error fetching farmers", error);
      }
    };
    fetchFarmers();
  }, []);

  // Function to mask Aadhaar
  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return "";
    return `****-***-${aadhaar.slice(-4)}`;
  };

  return (
    <div className="list-container">
      <h3>Farmers List</h3>
      <table className="farmer-table">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Name</th>
            <th>Aadhaar No.</th>
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
              <td><span className="farmer-id">{f.farmerId}</span></td>
              <td>{f.name}</td>
              <td>{maskAadhaar(f.aadhaarNumber)}</td>
              <td>{f.state}</td>
              <td>{f.district}</td>
              <td>{f.mandal}</td>
              <td>
                {f.status === "Approved" && (
                  <span className="status approved">Approved</span>
                )}
                {f.status === "Return" && (
                  <span className="status return">Return</span>
                )}
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
// Employee List
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
              <td>
                <span className="employee-id">{e.employeeId}</span>
              </td>
              <td>{e.name}</td>
              <td>{e.designation}</td>
              <td>{e.district}</td>
              <td>{e.contactNumber}</td>
              <td>{e.onboardDate}</td>
              <td>
                {e.status === "Active" && (
                  <span className="status active">Active</span>
                )}
                {e.status === "Inactive" && (
                  <span className="status inactive">Inactive</span>
                )}
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