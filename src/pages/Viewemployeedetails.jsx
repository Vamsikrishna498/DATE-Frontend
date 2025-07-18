import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";
import logo3 from "../assets/rightlogo.png";
import logo4 from "../assets/middle.png";
import '../styles/Adminconfig.css';

const ViewEmployee = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const methods = useForm();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);
      setValue("photo", file);
    }
  };

  const sidebarSteps = [
    "Employee Details",
    "Contact Details",
    "Other Details",
    "Address",
    "Professional Details",
    "Bank Details",
    "Documents",
    "Portal Access"
  ];

  const countries = [
    { id: 1, name: "India" },
    { id: 2, name: "USA" },
  ];

  const states = [
    { id: 1, name: "Telangana" },
    { id: 2, name: "Andhra Pradesh" },
  ];

  const districts = [
    { id: 1, name: "Hyderabad" },
    { id: 2, name: "Rangareddy" },
  ];

  const blocks = [
    { id: 1, name: "Madhapur" },
    { id: 2, name: "Gachibowli" },
  ];

  const villages = [
    { id: 1, name: "Village A" },
    { id: 2, name: "Village B" },
  ];

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  fetch(`http://localhost:8080/api/employees/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Employee Data:", data);
      setEmployee(data);
      setValue("salutation", data.salutation || "");
      setValue("firstName", data.firstName || "");
      setValue("middleName", data.middleName || "");
      setValue("lastName", data.lastName || "");
      setValue("gender", data.gender || "");
      setValue("dob", data.dob || "");
      setValue("nationality", data.nationality || "");
      setValue("contactNumber", data.contactNumber || "");
      setValue("email", data.email || "");
      setValue("relationType", data.relationType || "");
      setValue("relationName", data.relationName || "");
      setValue("altNumber", data.altNumber || "");
      setValue("altNumberType", data.altNumberType || "");
      setValue("country", data.country || "");
      setValue("state", data.state || "");
      setValue("district", data.district || "");
      setValue("block", data.block || "");
      setValue("village", data.village || "");
      setValue("zipcode", data.zipcode || "");
      setValue("sector", data.sector || "");
      setValue("education", data.education || "");
      setValue("experience", data.experience || "");
      setValue("bankName", data.bankName || "");
      setValue("accountNumber", data.accountNumber || "");
      setValue("branchName", data.branchName || "");
      setValue("ifscCode", data.ifscCode || "");
      setValue("documentType", data.documentType || "");
      setValue("documentNumber", data.documentNumber || "");
      setValue("role", data.role || "");
      setValue("accessStatus", data.accessStatus || "");
      setPhotoPreview(data.photoUrl ? `http://localhost:8080${data.photoUrl}` : null);
    })
    .catch((err) => console.error(err));
}, [employeeId, setValue]);

 
 
  return (
    <div className="employee-view-container">
      <div className="employee-view-header">
        <img src={logo3} alt="Logo" className="emploee-view-logo-img" />
        <div className="employee-logo-section" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {photoPreview ? (
            <img src={photoPreview} alt="User Icon" className="user-icon" />
          ) : (
            <span className="user-icon">User</span>
          )}
          <div className="one">{employee?.firstName || "Employee Name"}</div>
          {dropdownOpen && (
            <div className="employee-dropdown-menu">
              <div className="dropdown-item">{employee?.firstName || "User Name"}</div>
              <div className="dropdown-item">👤 My Profile</div>
              <div className="dropdown-item">⚙️ Account Settings</div>
              <div className="dropdown-item">❓ Need Help?</div>
              <div className="dropdown-item">📲 Sign Out</div>
            </div>
          )}
        </div>
      </div>
 
      <div className="header-background">
        <img src={logo4} alt="Field" className="employee-bg-img" />
        <div className="employee-photo-id-card">
          <div className="edit-photo-box">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <span className="photo-placeholder">Employee photo</span>
            )}
          </div>
           <div className="farmer-id-name">
            <div className="farmer-id">ID: <strong>{employee?.id || "--"}</strong></div>
            <div className="one">{employee?.firstName || "Employee Name"}</div>
          </div>
        </div>
      </div>
 
       <div className="e-body-content">
        <div className="e-sidebar">
          {sidebarSteps.map((label, idx) => (
            <div
              key={idx}
              className={`e-sidebar-item ${currentStep === idx ? "active" : ""}`}
              onClick={() => {
                setCurrentStep(idx);
                setIsEditMode(false);
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => console.log("Submitted", data))} className="view-employee-form">
            <div className="employee-step-container">
     {currentStep === 0 && !isEditMode && (
  <>
    <h2>Employee Details</h2>
    <button type="button" onClick={() => setIsEditMode(true)} className="employee-view-button">Edit</button>

    <div className="viewinfo-row">
      {/* Photo */}
      <div className="viewinfo-column" style={{ flexBasis: "100%" }}>
        <strong>Photo:</strong>{" "}
        {employee?.photoUrl ? (
          <img
            src={`http://localhost:8080${employee.photoUrl}`}
            alt="Employee"
            style={{
              height: "100px",
              borderRadius: "8px",
              marginTop: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          />
        ) : (
          "No photo uploaded"
        )}
      </div>

      {/* Text Details */}
      <div className="viewinfo-column"><strong>Salutation:</strong> {employee?.salutation || "-"}</div>
      <div className="viewinfo-column"><strong>First Name:</strong> {employee?.firstName || "-"}</div>
      <div className="viewinfo-column"><strong>Middle Name:</strong> {employee?.middleName || "-"}</div>
      <div className="viewinfo-column"><strong>Last Name:</strong> {employee?.lastName || "-"}</div>
      <div className="viewinfo-column"><strong>Gender:</strong> {employee?.gender || "-"}</div>
      <div className="viewinfo-column">
        <strong>DOB:</strong>{" "}
        {employee?.dob ? new Date(employee.dob).toLocaleDateString("en-IN") : "-"}
      </div>
      <div className="viewinfo-column"><strong>Nationality:</strong> {employee?.nationality || "-"}</div>
    </div>
  </>
)}


              {/* Step 1: Contact Details */}
{currentStep === 1 && (
  <>
    <h2>Contact Details</h2>
 
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
 
        <div className="viewinfo-row">
          <div><strong>Contact Number:</strong> {watch("contactNumber") || "-"}</div>
          <div><strong>Email:</strong> {watch("email") || "-"}</div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="employeeform-leftgrid">
            {/* Contact Number */}
            <div>
              <label className="label">
                Contact Number <span className="required">*</span>
              </label>
              <input
                type="text"
                className="input"
                placeholder="10-digit number"
                {...register("contactNumber", {
                  required: "Contact Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                })}
              />
              {errors.contactNumber && (
                <p className="error">{errors.contactNumber.message}</p>
              )}
            </div>
 
            {/* Email */}
            <div>
              <label className="label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                className="input"
                placeholder="example@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
                    <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
        </div>
          </div>
        </div>
      </>
    )}
  </>
)}
     
      {currentStep === 2 && (
  <>
    <h2>Other Details</h2>
 
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
 
        <div className="viewinfo-row">
          <div><strong>Relation:</strong> {watch("relationType") || "-"}</div>
          <div><strong>Father Name:</strong> {watch("relationName") || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Alternative Number:</strong> {watch("altNumber") || "-"}</div>
          <div><strong>Alternative Type:</strong> {watch("altNumberType") || "-"}</div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="employeeform-leftgrid">
            {/* Relation */}
            <div>
              <label className="label" htmlFor="relationType">
                Select <span className="required">*</span>
              </label>
              <select
                id="relationType"
                className="input"
                {...register("relationType", { required: "Please select a relation" })}
              >
                <option value="">-- Select --</option>
                <option value="do">D/O</option>
                <option value="so">S/O</option>
                <option value="wo">W/O</option>
              </select>
              {errors.relationType && <p className="error">{errors.relationType.message}</p>}
            </div>
 
            {/* Father Name */}
            <div>
              <label className="label">Father Name</label>
              <input
                type="text"
                placeholder="Krishna Kumar"
                className="input"
                {...register("relationName")}
              />
              {errors.relationName && <p className="error">{errors.relationName.message}</p>}
            </div>
          </div>
 
          <div className="employeeform-rightgrid">
            {/* Alternative Number */}
            <div>
              <label className="label">Alternative Number</label>
              <input
                type="text"
                placeholder="91-987xxxxxx16"
                className="input"
                {...register("altNumber")}
              />
              {errors.altNumber && <p className="error">{errors.altNumber.message}</p>}
            </div>
 
            {/* Alternative Type */}
            <div>
              <label className="label" htmlFor="altNumberType">
                Alternative Type <span className="required">*</span>
              </label>
              <select
                id="altNumberType"
                className="input"
                {...register("altNumberType", { required: "Please select an alternative type" })}
              >
                <option value="">Select Relation</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </select>
              {errors.altNumberType && <p className="error">{errors.altNumberType.message}</p>}
            </div>
          </div>
          <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
         
        </div>
        </div>
 
       
      </>  
    )}
  </>
)}
   
          {currentStep === 3 && (
  <>
    <h2>Address Details</h2>
 
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
 
        <div className="viewinfo-row">
          <div><strong>Country:</strong> {watch("country") || "-"}</div>
          <div><strong>State:</strong> {watch("state") || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>District:</strong> {watch("district") || "-"}</div>
          <div><strong>Block (Mandal):</strong> {watch("block") || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Village:</strong> {watch("village") || "-"}</div>
          <div><strong>Zipcode:</strong> {watch("zipcode") || "-"}</div>
        </div>
      </>
    ) : (
      <>
        <div className="employee-edit-main-form-grid">
          <div className="employeeform-leftgrid">
            {/* Country */}
            <div>
              <label className="label">Country <span className="required">*</span></label>
              <select {...register("country")} className="input">
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <p className="error">{errors.country?.message}</p>
            </div>
 
            {/* State */}
            <div>
              <label className="label">State <span className="required">*</span></label>
              <select {...register("state")} className="input">
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <p className="error">{errors.state?.message}</p>
            </div>
 
            {/* District */}
            <div>
              <label className="label">District <span className="required">*</span></label>
              <select {...register("district")} className="input">
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <p className="error">{errors.district?.message}</p>
            </div>
             <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
         
        </div>
          </div>
 
          <div className="employeeform-rightgrid">
            {/* Block (mandal) */}
            <div>
              <label className="label">Block (Mandal) <span className="required">*</span></label>
              <select {...register("block")} className="input">
                <option value="">Select Block</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <p className="error">{errors.block?.message}</p>
            </div>
 
            {/* Village */}
            <div>
              <label className="label">Village <span className="required">*</span></label>
              <select {...register("village")} className="input">
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
              <p className="error">{errors.village?.message}</p>
            </div>
 
            {/* Zipcode */}
            <div>
              <label className="label">Zipcode <span className="required">*</span></label>
              <input
                type="text"
                placeholder="56xxxx"
                className="input"
                {...register("zipcode")}
              />
              <p className="error">{errors.zipcode?.message}</p>
            </div>
          </div>
        </div>
      </>
    )}
  </>
)}
       
        {currentStep === 4 && (
  <>
    <h2>Professional Details</h2>
 
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
 
        <div className="viewinfo-row">
          <div>
            <strong>Education:</strong>{" "}
            {watch("education") || "-"}
          </div>
          <div>
            <strong>Experience:</strong>{" "}
            {watch("experience") || "-"}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="employeeform-leftgrid">
            {/* Education */}
            <div>
              <label className="label">Education</label>
              <select className="input" {...register("education")}>
                <option value="">Select</option>
                <option value="Primary Schooling">Primary Schooling</option>
                <option value="High School">High School</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Degree">Degree</option>
                <option value="Graduate">Graduate</option>
                <option value="Post-Graduate">Post-Graduate</option>
              </select>
            </div>
 
            {/* Experience */}
            <div>
              <label className="label">Experience</label>
              <input
                type="text"
                placeholder="e.g. 15 Years"
                className="input"
                {...register("experience")}
              />
            </div>
            <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
        </div>
          </div>
        </div>
 
      </>
    )}
  </>
)}
     
      {currentStep === 5 && (
  <>
    <h2>Bank Details</h2>
 
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
 
        <div className="viewinfo-row">
          <div><strong>Bank Name:</strong> {watch("bankName") || "-"}</div>
          <div><strong>Account Number:</strong> {watch("accountNumber") || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Branch Name:</strong> {watch("branchName") || "-"}</div>
          <div><strong>IFSC Code:</strong> {watch("ifscCode") || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div>
            <strong>Passbook:</strong>{" "}
            {watch("passbook")?.name ? watch("passbook").name : "No file uploaded"}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="employeeform-leftgrid">
            <div>
              <label className="label">Bank Name</label>
              <input
                type="text"
                placeholder="HDFC Bank"
                className="input"
                {...register("bankName")}
              />
            </div>
 
            <div>
              <label className="label">Account Number</label>
              <input
                type="text"
                placeholder="281398301653"
                className="input"
                {...register("accountNumber")}
              />
            </div>
 
            <div>
              <label className="label">Branch Name</label>
              <input
                type="text"
                placeholder="Madhapur"
                className="input"
                {...register("branchName")}
              />
            </div>
             <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
   
        </div>
          </div>
 
          <div className="employeeform-rightgrid">
            <div>
              <label className="label">IFSC Code</label>
              <input
                type="text"
                placeholder="HDFC0028"
                className="input"
                {...register("ifscCode")}
              />
            </div>
 
            <div>
              <label className="label">Passbook</label>
              <input
                type="file"
                className="input"
                onChange={(e) => {
                  setValue("passbook", e.target.files[0]);
                }}
              />
              {watch("passbook")?.name && (
                <p>Uploaded: {watch("passbook").name}</p>
              )}
            </div>
          </div>
         
        </div>
 
       
      </>
    )}
  </>
)}
           
       {currentStep === 6 && (
  <>
    <h2>Documents</h2>
 
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
 
        <div className="viewinfo-row">
          <div>
            <strong>Document Type:</strong>{" "}
            {watch("documentType") || "-"}
          </div>
          <div>
            <strong>File:</strong>{" "}
            {watch("documentNumber") || "No file uploaded"}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="employeeform-leftgrid">
            {/* Document Type */}
            <div>
              <label className="label">Add Document <span className="required">*</span></label>
              <select
                className="input"
                {...register("documentType", { required: "Document type is required" })}
              >
                <option value="">Select</option>
                <option value="voter">ID/ Voter Card</option>
                <option value="aadhar">Aadhar Number</option>
                <option value="pan">PAN Number</option>
              </select>
              {errors.documentType && (
                <p className="error">{errors.documentType.message}</p>
              )}
            </div>
 
            {/* Upload File */}
            <div>
              <label className="label">Upload <span className="required">*</span></label>
              <input
                type="file"
                className="input"
                onChange={(e) => {
                  setValue("documentNumber", e.target.files?.[0]);
                }}
              />
              {watch("documentNumber")?.name && (
                <p>Uploaded: {watch("documentNumber").name}</p>
              )}
            </div>
           
        <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
        </div>
          </div>
        </div>
 
      </>
    )}
  </>
)}
              {currentStep === 7 && (
  <>
    <h2>Portal Access Info</h2>
    {!isEditMode ? (
      <>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="employee-view-button"
        >
          Edit
        </button>
        <div className="viewinfo-row">
          <div><strong>Role / Designation:</strong> {watch("role") || "-"}</div>
          <div><strong>Access Status:</strong> {watch("accessStatus") || "-"}</div>
        </div>
      </>
    ) : (
      <div className="employee-edit-main-form-grid">
        <div className="employeeform-leftgrid">
          <label className="label">Role / Designation <span className="required">*</span></label>
          <select className="input" {...register("role", { required: true })}>
            <option value="">Select</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
        </div>
        </div>
 
        <div className="employeeform-rightgrid">
          <label className="label">Access Status <span className="required">*</span></label>
          <select className="input" {...register("accessStatus", { required: true })}>
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    )}
  </>
)}
 
              {/* You can continue similarly for steps 1–6 */}
 
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
 
export default ViewEmployee;
 