import axios from "axios"; 
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo3 from "../assets/rightlogo.png";
import logo4 from "../assets/middle.png";
import "../styles/Viewemployee.css";

const ViewEmployee = () => {
  const navigate = useNavigate();
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
  const watchedFields = watch();

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
  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Employee API response:", response.data); // ADD THIS LINE

      if (response.data) {
        setEmployee(response.data);
        setPhotoPreview(response.data.photoUrl || null);
      } else {
        setError("No employee data returned.");
      }
    } catch (err) {
      console.error("❌ Error fetching employee:", err);
      setError("Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  };

  if (employeeId) fetchEmployee();
}, [employeeId]);



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
          <div className="one">{watchedFields.firstName || "Employee Name"}</div>
          {dropdownOpen && (
            <div className="employee-dropdown-menu">
              <div className="dropdown-item">{watchedFields.firstName || "User Name"}</div>
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
            <div className="one">{watchedFields.firstName || "Employee Name"}</div>
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
            <div className="top-bar">
        <button
          className="go-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Go to Dashboard
        </button>
      </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => console.log("Submitted", data))} className="view-employee-form">
            <div className="employee-step-container">
            {currentStep === 0 && (
  <>
    <h2>Employee Details</h2>
    {!isEditMode ? (
      <>
        <button type="button" onClick={() => setIsEditMode(true)} className="employee-view-button">Edit</button>
        <div className="viewinfo-row">
          <div><strong>Photo:</strong> {photoPreview ? (<img src={photoPreview} alt="Employee" className="photo-preview" />) : "No photo uploaded"}</div>
          <div><strong>Salutation:</strong> {watchedFields.salutation || "-"}</div>
          <div><strong>First Name:</strong> {watchedFields.firstName || "-"}</div>
          <div><strong>Middle Name:</strong> {watchedFields.middleName || "-"}</div>
          <div><strong>Last Name:</strong> {watchedFields.lastName || "-"}</div>
          <div><strong>Gender:</strong> {watchedFields.gender || "-"}</div>
          <div><strong>DOB:</strong> {watchedFields.dob || "-"}</div>
          <div><strong>Nationality:</strong> {watchedFields.nationality || "-"}</div>
        </div>
        
      </>
    ) : (
        
      <div className="employee-edit-main-form-grid">
      
        {/* Left Grid */}
        <div className="employeeform-leftgrid">
          <label className="label">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handlePhotoChange(e);
              setValue("photo", e.target.files?.[0]);
            }}
          />

          <label className="label">Salutation <span className="required">*</span></label>
          <select {...register("salutation")}>
            <option value="">Select</option>
            <option value="Mr">Mr</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
            <option value="Miss.">Miss.</option>
            <option value="Dr.">Dr.</option>
          </select>

          <label className="label">First Name <span className="required">*</span></label>
          <input placeholder="Enter First Name" {...register("firstName")} />

          <label className="label">Middle Name <span className="required">*</span></label>
          <input placeholder="Enter Middle Name" {...register("middleName")} />
           <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
        </div>
        </div>
           
        {/* Right Grid */}
        <div className="employeeform-rightgrid">
          <label className="label">Last Name <span className="required">*</span></label>
          <input placeholder="Enter Last Name" {...register("lastName")} />
          <label className="label">Gender <span className="required">*</span></label>
          <select {...register("gender")}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
          </select>

          <label className="label">Date of Birth <span className="required">*</span></label>
          <input type="date" {...register("dob")} />

          <label className="label">Nationality <span className="required">*</span></label>
          <select {...register("nationality")}>
            <option value="">Select</option>
            <option value="Indian">Indian</option>
          </select>
        </div>
       
      </div>
      
    )}
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
          <div>
            <strong>Contact Number:</strong> {watchedFields.contactNumber || "-"}
          </div>
          <div>
            <strong>Email:</strong> {watchedFields.email || "-"}
          </div>
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
          <div><strong>Relation:</strong> {watchedFields.relation || "-"}</div>
          <div><strong>Father Name:</strong> {watchedFields.fatherName || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Alternative Number:</strong> {watchedFields.altNumber || "-"}</div>
          <div><strong>Alternative Type:</strong> {watchedFields.alternativeType || "-"}</div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="employeeform-leftgrid">
            {/* Relation */}
            <div>
              <label className="label" htmlFor="relation">
                Select <span className="required">*</span>
              </label>
              <select
                id="relation"
                className="input"
                {...register("relation", { required: "Please select a relation" })}
              >
                <option value="">-- Select --</option>
                <option value="do">D/O</option>
                <option value="so">S/O</option>
                <option value="wo">W/O</option>
              </select>
              {errors.relation && <p className="error">{errors.relation.message}</p>}
            </div>

            {/* Father Name */}
            <div>
              <label className="label">Father Name</label>
              <input
                type="text"
                placeholder="Krishna Kumar"
                className="input"
                {...register("fatherName")}
              />
              {errors.fatherName && <p className="error">{errors.fatherName.message}</p>}
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
              <label className="label" htmlFor="alternativeType">
                Alternative Type <span className="required">*</span>
              </label>
              <select
                id="alternativeType"
                className="input"
                {...register("alternativeType", { required: "Please select an alternative type" })}
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
              {errors.alternativeType && <p className="error">{errors.alternativeType.message}</p>}
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
          <div><strong>Country:</strong> {watchedFields.address?.country || "-"}</div>
          <div><strong>State:</strong> {watchedFields.address?.state || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>District:</strong> {watchedFields.address?.district || "-"}</div>
          <div><strong>Block (Mandal):</strong> {watchedFields.address?.block || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Village:</strong> {watchedFields.address?.village || "-"}</div>
          <div><strong>Zipcode:</strong> {watchedFields.address?.zipcode || "-"}</div>
        </div>
      </>
    ) : (
      <>
        <div className="employee-edit-main-form-grid">
          <div className="employeeform-leftgrid">
            {/* Country */}
            <div>
              <label className="label">Country <span className="required">*</span></label>
              <select {...register("address.country")} className="input">
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <p className="error">{errors.address?.country?.message}</p>
            </div>

            {/* State */}
            <div>
              <label className="label">State <span className="required">*</span></label>
              <select {...register("address.state")} className="input">
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <p className="error">{errors.address?.state?.message}</p>
            </div>

            {/* District */}
            <div>
              <label className="label">District <span className="required">*</span></label>
              <select {...register("address.district")} className="input">
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <p className="error">{errors.address?.district?.message}</p>
            </div>
             <div className="action-buttons">
          <button type="submit" className="employee-view-button">Save</button>
         
        </div>
          </div>

          <div className="employeeform-rightgrid">
            {/* Block (mandal) */}
            <div>
              <label className="label">Block (Mandal) <span className="required">*</span></label>
              <select {...register("address.block")} className="input">
                <option value="">Select Block</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <p className="error">{errors.address?.block?.message}</p>
            </div>

            {/* Village */}
            <div>
              <label className="label">Village <span className="required">*</span></label>
              <select {...register("address.village")} className="input">
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
              <p className="error">{errors.address?.village?.message}</p>
            </div>

            {/* Zipcode */}
            <div>
              <label className="label">Zipcode <span className="required">*</span></label>
              <input
                type="text"
                placeholder="56xxxx"
                className="input"
                {...register("address.zipcode")}
              />
              <p className="error">{errors.address?.zipcode?.message}</p>
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
            {watchedFields.professional?.education || "-"}
          </div>
          <div>
            <strong>Experience:</strong>{" "}
            {watchedFields.professional?.experience || "-"}
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
              <select className="input" {...register("professional.education")}>
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
                {...register("professional.experience")}
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
          <div><strong>Bank Name:</strong> {watchedFields.bank?.bankName || "-"}</div>
          <div><strong>Account Number:</strong> {watchedFields.bank?.accountNumber || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Branch Name:</strong> {watchedFields.bank?.branchName || "-"}</div>
          <div><strong>IFSC Code:</strong> {watchedFields.bank?.ifscCode || "-"}</div>
        </div>
        <div className="viewinfo-row">
          <div>
            <strong>Passbook:</strong>{" "}
            {watchedFields.bank?.passbook?.name ? watchedFields.bank.passbook.name : "No file uploaded"}
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
                {...register("bank.bankName")}
              />
            </div>

            <div>
              <label className="label">Account Number</label>
              <input
                type="text"
                placeholder="281398301653"
                className="input"
                {...register("bank.accountNumber")}
              />
            </div>

            <div>
              <label className="label">Branch Name</label>
              <input
                type="text"
                placeholder="Madhapur"
                className="input"
                {...register("bank.branchName")}
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
                {...register("bank.ifscCode")}
              />
            </div>

            <div>
              <label className="label">Passbook</label>
              <input
                type="file"
                className="input"
                onChange={(e) => {
                  setValue("bank.passbook", e.target.files[0]);
                }}
              />
              {watchedFields.bank?.passbook?.name && (
                <p>Uploaded: {watchedFields.bank.passbook.name}</p>
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
            {watchedFields.documents?.documentType || "-"}
          </div>
          <div>
            <strong>File:</strong>{" "}
            {watchedFields.documents?.file?.name || "No file uploaded"}
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
                {...register("documents.documentType", { required: "Document type is required" })}
              >
                <option value="">Select</option>
                <option value="voter">ID/ Voter Card</option>
                <option value="aadhar">Aadhar Number</option>
                <option value="pan">PAN Number</option>
              </select>
              {errors.documents?.documentType && (
                <p className="error">{errors.documents.documentType.message}</p>
              )}
            </div>

            {/* Upload File */}
            <div>
              <label className="label">Upload <span className="required">*</span></label>
              <input
                type="file"
                className="input"
                onChange={(e) => {
                  setValue("documents.file", e.target.files?.[0]);
                }}
              />
              {watchedFields.documents?.file?.name && (
                <p>Uploaded: {watchedFields.documents.file.name}</p>
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
          <div><strong>Role / Designation:</strong> {watchedFields.portalAccess?.role || "-"}</div>
          <div><strong>Access Status:</strong> {watchedFields.portalAccess?.status || "-"}</div>
        </div>
      </>
    ) : (
      <div className="employee-edit-main-form-grid">
        <div className="employeeform-leftgrid">
          <label className="label">Role / Designation <span className="required">*</span></label>
          <select className="input" {...register("portalAccess.role", { required: true })}>
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
          <select className="input" {...register("portalAccess.status", { required: true })}>
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
