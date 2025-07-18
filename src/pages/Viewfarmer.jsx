import React, { useEffect, useState } from "react";
 import { useFormContext } from "react-hook-form";
import "../styles/FarmerView.css";
import logo3 from "../assets/rightlogo.png";
import logo4 from "../assets/middle.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import stepSchemas from '../validations/stepSchemas';

 

  const ViewFarmer = () => {
  const navigate = useNavigate();
  const { farmerId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [farmer, setFarmer] = useState({
  waterSource: "",
  borewellDischarge: "",
  summerDischarge: "",
  borewellLocation: "",
  voterId: "",
  aadharNumber: "",
  panNumber: "",
  ppbNumber: "",
  documentType: "",
  // add other fields as needed
});

 

 const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm();

const watchedFields = watch();

const [photoPreviewStep0, setPhotoPreviewStep0] = useState(null);
const [photoPreviewStep3, setPhotoPreviewStep3] = useState(null);
const [cropCategoryStep3, setCropCategoryStep3] = useState("");
const [waterSourceCategory, setWaterSourceCategory] = useState("");
const [selectedIrrigationTab, setSelectedIrrigationTab] = useState("Current");
const cropOptions = {
  Grains: ["Rice", "Wheat", "Maize"],
  Vegetables: ["Tomato", "Carrot", "Spinach"],
  Fruits: ["Mango", "Banana", "Papaya"]
};

const waterSourceOptions = ["Borewell", "Open Well", "Canal", "Tank", "River", "Drip"];

const handlePhotoChangeStep3 = (e) => {
  const file = e.target.files[0];
  if (file) {
    setValue("photoStep3", file, { shouldValidate: true });
    setPhotoPreviewStep3(URL.createObjectURL(file));
  }
};

  const [farmerData, setFarmerData] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  fetch(`http://localhost:8080/api/farmers/${farmerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Farmer Data:", data); // Check the photoFileName here!
      setFarmerData(data);
      reset(data); // <-- This line populates the form fields!
    })
    .catch((err) => console.error(err));
}, [farmerId, reset]);

const sidebarSteps = [
  "Personal Information",
  "Address",
  "Professional Information",
  "Current Crop",
  "Proposed Crop",
  "Irrigation",
  "Bank",
  "Documents"
];
 
  return (
   <div className="farmer-view-container">
     <div className="farmer-view-header">
  {/* Left Logo */}
   <img src={logo3} alt="DATE Logo" className="logo-img" />
  <div className="logo-section"onClick={() => setDropdownOpen(!dropdownOpen)}>  
  {photoPreviewStep0 ? (
    <img src={photoPreviewStep0} alt="User Icon" className="user-icon" />
  ) : (
    <span className="user-icon">User</span>
  )}
  <div className="one">{watch("firstName") || "Farmer Name"}</div>

  {/* 👇 Dropdown shown on click */}
  {dropdownOpen && (
    <div className="dropdown-menu">
      <div className="dropdown-item">{watch("firstName") || "User Name"}</div>
      <div className="dropdown-item">👤 My Profile</div>
      <div className="dropdown-item">⚙️ Account Settings</div>
      <div className="dropdown-item">❓ Need Help?</div>
      <div className="dropdown-item">📲 Sign Out</div>
    </div>
  )}

  </div>
  </div>
  {/* Background Image with Overlay */}
  <div className="header-background">
    <img src={logo4} alt="Field" className="bg-img" />

    {/* Center Card with Photo + ID + Name */}
    <div className="photo-id-card">
       <div className="edit-photo-box">
            {photoPreviewStep0 ? (
             <img src={photoPreviewStep0} alt="Preview" className="farmer-photo-preview" />
            ) : (
                  <span className="farmer-photo-placeholder"> Farmer photo </span>
             )}
         </div>
         <div className="farmer-id-name">
      <div className="farmer-id">ID: <strong>{farmer?.id}</strong></div>
      <div className="one"> {watch("firstName") ? watch("firstName") : "Farmer Name"} </div> 
      </div>
    </div>
  </div> 

      <div className="body-content">
        {/* Sidebar */}
        <div className="sidebar">
          {sidebarSteps.map((item, index) => (
            <div
              key={index}
              className={`sidebar-item ${currentStep === index ? "active" : ""}`}
              onClick={() => {
                setCurrentStep(index);
                setIsEditMode(false);
              }}
            >
              {item}
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
 
    <form onSubmit={handleSubmit((data) => console.log("Submitted", data))} className="view-farmer-form">
     
    <div className="step-container">
      <h2>{sidebarSteps[currentStep]}</h2>
 
      {/* Step 0: Personal Information */}
    {currentStep === 0 && (
  <>
    {!isEditMode ? (
      <>
        <button type="button" onClick={() => setIsEditMode(true)} className="viwe-button">
          Edit
        </button>

        {/* ✅ View Mode Photo */}
        <div className="viewinfo-row">
          <strong>Photo:</strong>
          {farmerData?.photoFileName ? (
            <div className="view-photo-box">
              <img
                src={`http://localhost:8080/uploads/${farmerData.photoFileName}`}
                alt={`Farmer ${farmerData.firstName || ""} ${farmerData.lastName || ""}`}
                className="view-photo"
                style={{
                  width: "200px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          ) : (
            <span className="text-muted">No Photo Uploaded</span>
          )}
        </div>

        {/* Remaining View Fields */}
        <div className="viewinfo-row">
          <div><strong>Salutation:</strong> {watchedFields.salutation}</div>
          <div><strong>Gender:</strong> {watchedFields.gender}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>First Name:</strong> {watchedFields.firstName}</div>
          <div><strong>Last Name:</strong> {watchedFields.lastName}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Middle Name:</strong> {watchedFields.middleName}</div>
          <div><strong>Date of Birth:</strong> {watchedFields.dateOfBirth}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Nationality:</strong> {watchedFields.nationality}</div>
          <div><strong>Father Name:</strong> {watchedFields.fatherName}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Contact Number:</strong> {watchedFields.contactNumber}</div>
          <div><strong>Alternative Number:</strong> {watchedFields.alternativeContactNumber}</div>
        </div>
        <div className="viewinfo-row">
          <div><strong>Alternative Type:</strong> {watchedFields.alternativeRelationType}</div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main form-grid">
          <div className="field-left">
            {/* ✅ Edit Mode Photo Upload */}
            <div className="viewform-row">
              <label>Photo <span className="required">*</span></label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setValue("photo", file, { shouldValidate: true });
                    setPhotoPreviewStep0(URL.createObjectURL(file));
                  }
                }}
              />
              {photoPreviewStep0 && (
                <img
                  src={photoPreviewStep0}
                  alt="Preview"
                  className="edit-photo-preview"
                  style={{
                    width: "200px",
                    height: "auto",
                    marginTop: "10px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              {errors.photo && <p className="error">{errors.photo.message}</p>}
            </div>

            {/* Left fields */}
            <label>Salutation <span className="required">*</span></label>
            <select {...register("salutation")} className="viweinput">
              <option value="">Select</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Miss.">Miss.</option>
              <option value="Dr.">Dr.</option>
            </select>
            {errors.salutation && <p className="error">{errors.salutation.message}</p>}

            <label>First Name <span className="required">*</span></label>
            <input {...register("firstName")} className="viweinput" />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}

            <label>Middle Name <span className="required">*</span></label>
            <input {...register("middleName")} className="viweinput" />
            {errors.middleName && <p className="error">{errors.middleName.message}</p>}

            <label>Last Name <span className="required">*</span></label>
            <input {...register("lastName")} className="viweinput" />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}
          </div>

          <div className="field-right">
            {/* Right fields */}
            <label>Gender <span className="required">*</span></label>
            <select {...register("gender")} className="viweinput">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
            </select>
            {errors.gender && <p className="error">{errors.gender.message}</p>}

            <label>Nationality <span className="required">*</span></label>
            <select {...register("nationality")} className="viweinput">
              <option value="">Select</option>
              <option value="Indian">Indian</option>
            </select>
            {errors.nationality && <p className="error">{errors.nationality.message}</p>}

            <label>Date of Birth <span className="required">*</span></label>
            <input type="date" {...register("dateOfBirth")} className="viweinput" />
            {errors.dateOfBirth && <p className="error">{errors.dateOfBirth.message}</p>}

            <label>Contact Number <span className="required">*</span></label>
            <input type="tel" maxLength={10} {...register("contactNumber")} className="viweinput" />
            {errors.contactNumber && <p className="error">{errors.contactNumber.message}</p>}

            <label>Father Name <span className="required">*</span></label>
            <input {...register("fatherName")} className="viweinput" />
            {errors.fatherName && <p className="error">{errors.fatherName.message}</p>}

            <label>Alternative Type <span className="required">*</span></label>
            <select {...register("alternativeType")} className="viweinput">
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

            <label>Alternative Number <span className="required">*</span></label>
            <input type="tel" maxLength={10} {...register("alternativeNumber")} className="viweinput" />
            {errors.alternativeNumber && <p className="error">{errors.alternativeNumber.message}</p>}
          </div>
        </div>

        <div className="action-buttons">
          <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>
            Save
          </button>
        </div>
      </>
    )}
  </>
)}


 
      {currentStep === 1 && (
        <div className="address-container">
 
          {!isEditMode ? (
            <>
              <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
 
              <div className="viewinfo-row">
                <div><strong>Country:</strong> {watchedFields.country}</div>
                <div><strong>State:</strong> {watchedFields.state}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>District:</strong> {watchedFields.district}</div>
                <div><strong>Mandal:</strong> {watchedFields.block}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>Village:</strong> {watchedFields.village}</div>
                <div><strong>Pincode:</strong> {watchedFields.pincode}</div>
              </div>
            </>
          ) : (
            <>
              <div className="edit-main">
                <div className="leftedit-grid">
                  <div className="viewform-row">
                    <label>Country:</label>
                    <input {...register("country")} placeholder="Country" />
                  </div>
                  <div className="viewform-row">
                    <label>State:</label>
                    <select {...register("state")}>
                      <option value="">Select your state</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  <div className="viewform-row">
                    <label>District:</label>
                    <input {...register("district")} placeholder="District" />
                  </div>
                </div>
 
                <div className="rightedit-grid">
                  <div className="viewform-row">
                    <label>Mandal:</label>
                    <input {...register("mandal")} placeholder="Mandal" />
                  </div>
                  <div className="viewform-row">
                    <label>Village:</label>
                    <input {...register("village")} placeholder="Village" />
                  </div>
                  <div className="viewform-row">
                    <label>Pincode:</label>
                    <input {...register("pincode")} placeholder="Pincode" />
                  </div>
                </div>
              </div>
 
              <div className="action-buttons">
                <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>Save</button>
              </div>
            </>
          )}
        </div>
      )}
      {currentStep === 2 && (
  <div className="professional-container">
 
    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
 
        <div className="viewinfo-row">
          <div><strong>Education:</strong> {watchedFields.education}</div>
          <div><strong>Experience:</strong> {watchedFields.experience}</div>
        </div>
      </>
    ) : (
      <>
        <div className="edit-main">
          <div className="leftedit-grid">
            <div className="viewform-row">
              <label>Education <span className="required">*</span></label>
              <select {...register("education")} className="input">
                <option value="">Select</option>
                <option value="Primary Schooling">Primary Schooling</option>
                <option value="High School">High School</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Degree">Degree</option>
                <option value="Graduate">Graduate</option>
                <option value="Post-Graduate">Post-Graduate</option>
              </select>
              {errors.education && <p className="error">{errors.education.message}</p>}
            </div>
          </div>
 
          <div className="rightedit-grid">
            <div className="viewform-row">
              <label>Experience <span className="required">*</span></label>
              <input
                {...register("experience")}
                placeholder="e.g. 15 Years"
                className="input"
              />
              {errors.experience && <p className="error">{errors.experience.message}</p>}
            </div>
          </div>
        </div>
 
        <div className="action-buttons">
          <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>Save</button>
        </div>
      </>
    )}
  </div>
)}
      {currentStep === 3 && (
  <div className="current-container">
    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
 
        <div className="viewinfo-row">
          {photoPreviewStep3 && (
            <div className="photo-box">
              <strong>Photo:</strong>
              <img src={photoPreviewStep3} alt="Preview" className="photo-preview" />
            </div>
          )}
          <div><strong>Survey Number:</strong> {watchedFields.currentSurveyNumber}</div>
          <div><strong>Total Land Holding:</strong> {watchedFields.currentLandHolding}</div>
          <div><strong>Geo-tag:</strong> {watchedFields.currentGeoTag}</div>
          <div><strong>Crop Category:</strong> {cropCategoryStep3}</div>
          <div><strong>Crop Name:</strong> {watchedFields.currentCrop}</div>
          <div><strong>Net Income:</strong> {watchedFields.currentNetIncome}</div>
          <div><strong>Soil Test:</strong> {watchedFields.currentSoilTest}</div>
          {watchedFields.currentSoilTest === "Yes" && (
            <div><strong>Soil Test Certificate:</strong> Uploaded</div>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="edit-main currentform-grid">
          <div className="cropform-columnleft">
            <div className="viewform-row">
              <label>Photo <span className="optional"></span></label>
              <input type="file" accept="image/*" onChange={handlePhotoChangeStep3} />
              {photoPreviewStep3 && (
                <img src={photoPreviewStep3} alt="Preview" className="photo-preview" />
              )}
            </div>
 
            <div className="viewform-row">
              <label>Survey Number <span className="required">*</span></label>
              <input {...register("currentSurveyNumber")} className="viweinput" />
              {errors.currentSurveyNumber && <p className="error">{errors.currentSurveyNumber.message}</p>}
            </div>
 
            <div className="viewform-row">
              <label>Total Land Holding (In Acres Nos)</label>
              <input
                type="number"
                step="any"
                {...register("currentLandHolding", { valueAsNumber: true })}
                className="viweinput"
              />
              {errors.currentLandHolding && <p className="error">{errors.currentLandHolding.message}</p>}
            </div>
 
            <div className="viewform-row">
              <label>Geo-tag</label>
              <input {...register("currentGeoTag")} className="viweinput" />
              {errors.currentGeoTag && <p className="error">{errors.currentGeoTag.message}</p>}
            </div>
          </div>
 
          <div className="cropform-columnright">
            <div className="viewform-row">
              <label>Select Crop Category</label>
              <select
                value={cropCategoryStep3}
                onChange={(e) => {
                  setCropCategoryStep3(e.target.value);
                  setValue("currentCrop", "");
                }}
                className="viweinput"
              >
                <option value="">Select</option>
                {Object.keys(cropOptions).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
 
            {cropCategoryStep3 && (
              <div className="viewform-row">
                <label>Select Crop Name</label>
                <select {...register("currentCrop")} className="viweinput">
                  <option value="">Select</option>
                  {cropOptions[cropCategoryStep3].map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                {errors.currentCrop && <p className="error">{errors.currentCrop.message}</p>}
              </div>
            )}
 
            <div className="viewform-row">
              <label>Net Income (As per Current Crop/Yr)</label>
              <input {...register("currentNetIncome")} className="viweinput" />
              {errors.currentNetIncome && <p className="error">{errors.currentNetIncome.message}</p>}
            </div>
 
            <div className="viewform-row">
              <label>Soil Test</label>
              <select {...register("currentSoilTest")} className="viweinput">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.currentSoilTest && <p className="error">{errors.currentSoilTest.message}</p>}
            </div>
 
            {watch("currentSoilTest") === "Yes" && (
              <div className="viewform-row">
                <label>Soil Test Certificate</label>
                <input type="file" {...register("currentSoilTestCertificate")} />
                {errors.currentSoilTestCertificate && (
                  <p className="error">{errors.currentSoilTestCertificate.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
 
        <div className="action-buttons">
          <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>Save</button>
        </div>
      </>
    )}
  </div>
)}
 
 

   {currentStep === 4 && (
  <div className="proposed-container">
 
    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
 
        <div className="viewinfo-row">
          <div><strong>Survey Number:</strong> {watchedFields.surveyNumber}</div>
          <div><strong>Geo-tag:</strong> {watchedFields.geoTag}</div>
          <div><strong>Crop Type:</strong> {watchedFields.cropType}</div>
          <div><strong>Soil Test:</strong> {watchedFields.soilTest}</div>
          <div><strong>Total Land Holding:</strong> {watchedFields.totalLandHolding}</div>
          <div><strong>Net Income:</strong> {watchedFields.netIncome}</div>
          <div>
            <strong>Soil Test Certificate:</strong>{" "}
            {watchedFields.soilTestCertificate ? "Uploaded" : "Not Uploaded"}
          </div>
        </div>
      </>
    ) : (
      <div className="edit-main proposedform-grid">
        <div className="proposedform-columnleft">
          <div className="viewform-row">
            <label>Survey Number <span className="required">*</span></label>
            <input {...register("surveyNumber")} className="viweinput" />
            {errors.surveyNumber && <p className="error">{errors.surveyNumber.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>Geo-tag <span className="required">*</span></label>
            <input
              {...register("geoTag")}
              placeholder="Latitude, Longitude"
              className="viweinput"
            />
            {errors.geoTag && <p className="error">{errors.geoTag.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>Crop Type <span className="required">*</span></label>
            <select {...register("cropType")} className="viweinput">
              <option value="">Select</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Cotton">Cotton</option>
            </select>
            {errors.cropType && <p className="error">{errors.cropType.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>Soil Test <span className="required">*</span></label>
            <select {...register("soilTest")} className="viweinput">
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.soilTest && <p className="error">{errors.soilTest.message}</p>}
          </div>
        </div>
 
        <div className="proposedform-columnright">
          <div className="viewform-row">
            <label>Total Land Holding (In Acres) <span className="required">*</span></label>
            <input {...register("totalLandHolding")} className="viweinput" />
            {errors.totalLandHolding && <p className="error">{errors.totalLandHolding.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>Net Income (Per Crop/Yr) <span className="required">*</span></label>
            <input {...register("netIncome")} className="viweinput" />
            {errors.netIncome && <p className="error">{errors.netIncome.message}</p>}
          </div>
 
          {watch("soilTest") === "Yes" && (
            <div className="viewform-row">
              <label>Soil Test Certificate</label>
              <input
                type="file"
                {...register("soilTestCertificate")}
                className="viweinput"
              />
              {errors.soilTestCertificate && (
                <p className="error">{errors.soilTestCertificate.message}</p>
              )}
            </div>
          )}
 
          <div className="action-buttons">
            <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}
 
  {currentStep === 5 && (
  <div className="view-irrigation-field">
    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">
          Edit
        </button>
        <div className="viewinfo-row">
          <div>
            <strong>Current Crop - Water Source:</strong> {watchedFields.currentWaterSource}
          </div>
          <div>
            <strong>Proposed Crop - Water Source:</strong> {watchedFields.proposedWaterSource}
          </div>
          <div>
            <strong>Discharge (LPH):</strong> {watchedFields.currentDischargeLPH}
          </div>
          <div>
            <strong>Summer Discharge:</strong> {watchedFields.summerDischarge}
          </div>
          <div>
            <strong>Location:</strong> {watchedFields.borewellLocation}
          </div>
        </div>
      </>
    ) : (
      <div className="irrigation-field">
        {/* Tabs Header */}
        <div className="tab-header">
          <span
            className={selectedIrrigationTab === "Current" ? "tab active" : "tab"}
            onClick={() => setSelectedIrrigationTab("Current")}
          >
            Current Crop Addition
          </span>
          <span
            className={selectedIrrigationTab === "Proposed" ? "tab active" : "tab"}
            onClick={() => setSelectedIrrigationTab("Proposed")}
          >
            Proposed Crop Addition
          </span>
        </div>

        {/* Current Crop Tab */}
        {selectedIrrigationTab === "Current" && (
          <div className="tab-content">
            <label>
              Water Source <span className="required">*</span>
              <select {...register("currentWaterSource")} defaultValue="">
                <option value="">Select</option>
                {waterSourceOptions.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </label>
            <p className="error">{errors.currentWaterSource?.message}</p>

            <label>
              Borewell wise Discharge in LPH <span className="optional"></span>
              <input {...register("currentDischargeLPH")} />
            </label>
            <p className="error">{errors.borewellDischarge?.message}</p>

            <label>
              Discharge during summer months <span className="optional"></span>
              <input {...register("summerDischarge")} />
            </label>
            <p className="error">{errors.summerDischarge?.message}</p>

            <label>
              Borewell location <span className="optional"></span>
              <input {...register("borewellLocation")} />
            </label>
            <p className="error">{errors.borewellLocation?.message}</p>
          </div>
        )}

        {/* Proposed Crop Tab */}
        {selectedIrrigationTab === "Proposed" && (
          <div className="tab-content">
            <label>
              Water Source <span className="required">*</span>
              <select {...register("proposedWaterSource")} defaultValue="">
                <option value="">Select</option>
                {waterSourceOptions.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </label>
            <p className="error">{errors.proposedWaterSource?.message}</p>

            <label>
              Borewell wise Discharge in LPH <span className="optional"></span>
              <input {...register("proposedBorewellDischarge")} />
            </label>
            <p className="error">{errors.proposedBorewellDischarge?.message}</p>

            <label>
              Discharge during summer months <span className="optional"></span>
              <input {...register("proposedSummerDischarge")} />
            </label>
            <p className="error">{errors.proposedSummerDischarge?.message}</p>

            <label>
              Borewell location <span className="optional"></span>
              <input {...register("proposedBorewellLocation")} />
            </label>
            <p className="error">{errors.proposedBorewellLocation?.message}</p>
          </div>
        )}

        <div className="action-buttons">
          <button
            type="button"
            className="viwe-button"
            onClick={() => setIsEditMode(false)}
          >
            Save
          </button>
        </div>
      </div>
    )}
  </div>
)}


 
   {currentStep === 6 && (
  <div className="other-container">
    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
        <div className="viewinfo-row">
          <div><strong>Bank Name:</strong> {watchedFields.bankName}</div>
          <div><strong>Account Number:</strong> {watchedFields.accountNumber}</div>
          <div><strong>Branch Name:</strong> {watchedFields.branchName}</div>
          <div><strong>IFSC Code:</strong> {watchedFields.ifscCode}</div>
        </div>
        <div className="viewinfo-row">
          <div>
            <strong>Passbook File:</strong><br />
            {watchedFields.passbookFile ? (
              <a
                href={URL.createObjectURL(watchedFields.passbookFile)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Passbook
              </a>
            ) : (
              "No file uploaded"
            )}
          </div>
        </div>
      </>
    ) : (
      <div className="proposedform-grid">
        <div className="proposedform-columnleft">
          <div className="viewform-row">
            <label>Bank Name <span className="optional"></span></label>
            <input type="text" {...register("bankName")} className="viweinput" />
            <p className="error">{errors.bankName?.message}</p>
          </div>

          <div className="viewform-row">
            <label>Account Number <span className="optional"></span></label>
            <input type="text" {...register("accountNumber")} className="viweinput" />
            <p className="error">{errors.accountNumber?.message}</p>
          </div>
        </div>

        <div className="proposedform-columnright">
          <div className="viewform-row">
            <label>Branch Name <span className="optional"></span></label>
            <input type="text" {...register("branchName")} className="viweinput" />
            <p className="error">{errors.branchName?.message}</p>
          </div>

          <div className="viewform-row">
            <label>IFSC Code <span className="optional"></span></label>
            <input type="text" {...register("ifscCode")} className="viweinput" />
            <p className="error">{errors.ifscCode?.message}</p>
          </div>

          <div className="viewform-row">
            <label>Passbook <span className="optional"></span></label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                setValue("passbookFile", file);
                trigger("passbookFile");
              }}
              className="viweinput"
            />
            <p className="error">{errors.passbookFile?.message}</p>
          </div>

          <div className="action-buttons">
            <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

   {currentStep === 7 && (
  <div className="document-container">
 
    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
        <div className="viewinfo-row">
          <div><strong>Aadhaar Number:</strong> {watchedFields.aadhaarNumber}</div>
          <div><strong>PAN Number:</strong> {watchedFields.panNumber}</div>
          <div><strong>Voter ID:</strong> {watchedFields.voterId}</div>
          <div><strong>Ration Card:</strong> {watchedFields.rationCard}</div>
          <div><strong>Aadhaar File:</strong> {watchedFields.aadhaarFile ? "Uploaded" : "Not Uploaded"}</div>
          <div><strong>PAN File:</strong> {watchedFields.panFile ? "Uploaded" : "Not Uploaded"}</div>
        </div>
      </>
    ) : (
      <div className="edit-main documentform-grid">
        <div className="left-column">
          <div className="viewform-row">
            <label>Aadhaar Number <span className="required">*</span></label>
            <input {...register("aadhaarNumber")} className="viweinput" />
            {errors.aadhaarNumber && <p className="error">{errors.aadhaarNumber.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>PAN Number</label>
            <input {...register("panNumber")} className="viweinput" />
            {errors.panNumber && <p className="error">{errors.panNumber.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>Voter ID</label>
            <input {...register("voterId")} className="viweinput" />
            {errors.voterId && <p className="error">{errors.voterId.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>Ration Card</label>
            <input {...register("rationCard")} className="viweinput" />
            {errors.rationCard && <p className="error">{errors.rationCard.message}</p>}
          </div>
        </div>
 
        <div className="right-column">
          <div className="viewform-row">
            <label>Aadhaar Upload</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              {...register("aadhaarFile")}
              className="viweinput"
            />
            {errors.aadhaarFile && <p className="error">{errors.aadhaarFile.message}</p>}
          </div>
 
          <div className="viewform-row">
            <label>PAN Upload</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              {...register("panFile")}
              className="viweinput"
            />
            {errors.panFile && <p className="error">{errors.panFile.message}</p>}
          </div>
 
          <div className="action-buttons">
            <button
              type="button"
              className="viwe-button"
              onClick={() => setIsEditMode(false)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}
 
    </div>
  </form>
 
      </div>
    </div>
  );
};
 
export default ViewFarmer; 