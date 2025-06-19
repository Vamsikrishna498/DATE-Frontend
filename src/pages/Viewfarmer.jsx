import React, { useEffect, useState } from "react";
import "../styles/FarmerView.css";
import logo3 from "../assets/rightlogo.png";
import logo4 from "../assets/middle.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import stepSchemas from '../validations/stepSchemas';

const ViewFarmer = () => {
  const { farmerId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(stepSchemas[currentStep]),
    defaultValues: {},
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  // Fetch Farmer Data
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/farmer/${farmerId}`);
        reset(res.data);
        if (res.data.photo) {
          setPhotoPreview(res.data.photo);
        }
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmerData();
  }, [farmerId, reset]);

  // Submit updated data
  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:8080/api/farmer/${farmerId}`, data);
      alert("Farmer updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  const [isEditing, setIsEditing] = useState(false); // toggle edit/view mode
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
// For text and select inputs
const handleChange = (e) => {
  const { name, value } = e.target;
  setFarmer((prev) => ({ ...prev, [name]: value }));
};

// For file inputs
const handleFileChange = (e) => {
  const { name, files } = e.target;
  setFarmer((prev) => ({ ...prev, [name]: files[0] }));
};

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sidebarSteps = [
    "Personal Information",
    "Address",
    "Professional Information",
    "Current Crop Information",
    "Proposed Crop Information",
    "Irrigation Details",
    "Other Information",
    "Documents",
  ];

  const watchedFields = watch();

  if (loading) return <p>Loading farmer data...</p>;

  return (
    <div className="farmer-view-container">
      {/* Header */}
      <div className="header">
        <img src={logo3} alt="DATE Logo" className="viwelogo" />
      </div>

      <div className="user-info">
        <img src={logo4} alt="middle img" className="middle" />
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
        </div>

        <FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)} className="view-farmer-form">
    <div className="step-container">
      <h2>{sidebarSteps[currentStep]}</h2>

      {/* Step 0: Personal Information */}
      {currentStep === 0 && (
        <>
          {!isEditMode ? (
            <>
              <button type="button" onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>

              <div className="viewinfo-row">
                <div><strong>Salutation:</strong> {watchedFields.salutation}</div>
                <div><strong>First Name:</strong> {watchedFields.firstName}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>Middle Name:</strong> {watchedFields.middleName}</div>
                <div><strong>Last Name:</strong> {watchedFields.lastName}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>Gender:</strong> {watchedFields.gender}</div>
                <div><strong>DOB:</strong> {watchedFields.dateOfBirth}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>Nationality:</strong> {watchedFields.nationality}</div>
                <div><strong>Father Name:</strong> {watchedFields.fatherName}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>Contact:</strong> {watchedFields.contactNumber}</div>
                <div><strong>Alt Contact:</strong> {watchedFields.alternativeNumber}</div>
              </div>
              {photoPreview && (
                <img src={photoPreview} alt="Photo" className="photo-preview" />
              )}
            </>
          ) : (
            <>
              <div className="edit-main">
                <div className="leftedit-grid">
                  <div className="viewform-row">
                    <label htmlFor="photo">Photo:</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                  <div className="viewform-row">
                    <label>Salutation:</label>
                    <input {...register("salutation")} placeholder="Salutation" />
                  </div>
                  <div className="viewform-row">
                    <label>First Name:</label>
                    <input {...register("firstName")} placeholder="First Name" />
                    {errors.firstName && <p className="error">{errors.firstName.message}</p>}
                  </div>
                  <div className="viewform-row">
                    <label>Middle Name:</label>
                    <input {...register("middleName")} placeholder="Middle Name" />
                  </div>
                  <div className="viewform-row">
                    <label>Last Name:</label>
                    <input {...register("lastName")} placeholder="Last Name" />
                  </div>
                  <div className="viewform-row">
                    <label>Gender:</label>
                    <input {...register("gender")} placeholder="Gender" />
                  </div>
                </div>

                <div className="rightedit-grid">
                  <div className="viewform-row">
                    <label>Date of Birth:</label>
                    <input type="date" {...register("dateOfBirth")} />
                  </div>
                  <div className="viewform-row">
                    <label>Nationality:</label>
                    <input {...register("nationality")} placeholder="Nationality" />
                  </div>
                  <div className="viewform-row">
                    <label>Father's Name:</label>
                    <input {...register("fatherName")} placeholder="Father Name" />
                  </div>
                  <div className="viewform-row">
                    <label>Contact Number:</label>
                    <input {...register("contactNumber")} placeholder="Contact Number" />
                  </div>
                  <div className="viewform-row">
                    <label>Alternative Number:</label>
                    <input {...register("alternativeNumber")} placeholder="Alternative Number" />
                  </div>
                  <div className="viewform-row">
                    <label>Alternative Type:</label>
                    <input {...register("alternativeType")} placeholder="Alternative Type" />
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button type="button" className="viwe-button" onClick={() => setIsEditMode(false)}>Save</button>
              </div>
            </>
          )}
        </>
      )}

      {currentStep === 1 && (
        <div className="step-container">

          {!isEditMode ? (
            <>
              <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>

              <div className="viewinfo-row">
                <div><strong>Country:</strong> {watchedFields.country}</div>
                <div><strong>State:</strong> {watchedFields.state}</div>
              </div>
              <div className="viewinfo-row">
                <div><strong>District:</strong> {watchedFields.district}</div>
                <div><strong>Mandal:</strong> {watchedFields.mandal}</div>
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
  <div className="step-container">

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
  <div className="step-container">

    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>

        <div className="viewinfo-row">
          <div><strong>Survey Numbers:</strong> {watchedFields.surveyNumber}</div>
          <div><strong>Total Land Holding:</strong> {watchedFields.totalLandHolding}</div>
          <div><strong>Geo-tag:</strong> {watchedFields.geoTag}</div>
          <div><strong>Selected Crop:</strong> {watchedFields.selectCrop}</div>
          <div><strong>Net Income:</strong> {watchedFields.netIncome}</div>
          <div><strong>Soil Test:</strong> {watchedFields.soilTest}</div>
          {watchedFields.soilTest === "Yes" && (
            <div><strong>Soil Test Certificate:</strong> Uploaded</div>
          )}
          {photoPreview && (
            <div className="photo-box">
              <strong>Photo:</strong>
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            </div>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="edit-main currentform-grid">
          <div className="leftedit-grid">
            <div className="viewform-row">
              <label>Photo <span className="optional">(Optional)</span></label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
              {photoPreview && <img src={photoPreview} alt="Preview" className="photo-preview" />}
            </div>

            <div className="viewform-row">
              <label>Survey Numbers <span className="required">*</span></label>
              <input {...register("surveyNumber")} className="viweinput" />
              {errors.surveyNumber && <p className="error">{errors.surveyNumber.message}</p>}
            </div>

            <div className="viewform-row">
              <label>Total Land Holding (In Acres Nos) <span className="required">*</span></label>
              <input {...register("totalLandHolding")} className="viweinput" />
              {errors.totalLandHolding && <p className="error">{errors.totalLandHolding.message}</p>}
            </div>

            <div className="viewform-row">
              <label>Geo-tag <span className="required">*</span></label>
              <input {...register("geoTag")} className="viweinput" />
              {errors.geoTag && <p className="error">{errors.geoTag.message}</p>}
            </div>
          </div>

          <div className="rightedit-grid">
            <div className="viewform-row">
              <label>Select Crop <span className="required">*</span></label>
              <select {...register("selectCrop")} className="viweinput">
                <option value="">Select</option>
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Cotton">Cotton</option>
              </select>
              {errors.selectCrop && <p className="error">{errors.selectCrop.message}</p>}
            </div>

            <div className="viewform-row">
              <label>Net Income (As per Current Crop/Yr) <span className="required">*</span></label>
              <input {...register("netIncome")} className="viweinput" />
              {errors.netIncome && <p className="error">{errors.netIncome.message}</p>}
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
  <div className="step-container">

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
  <div className="irrigation-field">


     {!isEditing ? (
      <>
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
        <div className="viweinfo-row">
          <div><strong>Water Source:</strong> {farmer.waterSource}</div>
          <div><strong>Discharge (LPH):</strong> {farmer.borewellDischarge}</div>
          <div><strong>Summer Discharge:</strong> {farmer.summerDischarge}</div>
          <div><strong>Borewell Location:</strong> {farmer.borewellLocation}</div>
        </div>
      </>
    ) : (
      <div className="proposedform-grid">
        <div className="proposedform-columnleft">

          <label>Water Source <span className="required">*</span></label>
          <select
            name="waterSource"
            value={farmer.waterSource}
            onChange={handleChange}
            className="viweinput"
          >
            <option value="">Select</option>
            <option value="Borewell">Borewell</option>
            <option value="Open Well">Open Well</option>
            <option value="Canal">Canal</option>
            <option value="Tank">Tank</option>
            <option value="River">River</option>
            <option value="Drip">Drip</option>
          </select>

          <label>Discharge (LPH) <span className="required">*</span></label>
          <input
            name="borewellDischarge"
            value={farmer.borewellDischarge}
            onChange={handleChange}
            className="viweinput"
            placeholder="Enter discharge rate"
          />

          <label>Summer Discharge <span className="required">*</span></label>
          <input
            name="summerDischarge"
            value={farmer.summerDischarge}
            onChange={handleChange}
            className="viweinput"
            placeholder="Enter summer discharge"
          />

          <label>Location <span className="required">*</span></label>
          <input
            name="borewellLocation"
            value={farmer.borewellLocation}
            onChange={handleChange}
            className="viweinput"  // ✅ fixed typo from 'viwenput'
            placeholder="Enter location"
          />

          <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
        </div>
      </div>
    )}
  </div>
)}

    {currentStep === 6 && (
  <div className="step-container">

    {!isEditMode ? (
      <>
        <button onClick={() => setIsEditMode(true)} className="viwe-button">Edit</button>
        <div className="viewinfo-row">
          <div><strong>Farming Type:</strong> {watchedFields.farmingType}</div>
          <div><strong>Livestock Owned:</strong> {watchedFields.livestock}</div>
          <div><strong>Farm Mechanization:</strong> {watchedFields.mechanization}</div>
          <div><strong>Other Occupation:</strong> {watchedFields.otherOccupation}</div>
        </div>
      </>
    ) : (
      <div className="proposedform-grid">
        <div className="proposedform-columnleft">
          <div className="viewform-row">
            <label>Farming Type <span className="required">*</span></label>
            <select {...register("farmingType")} className="viweinput">
              <option value="">Select</option>
              <option value="Organic">Organic</option>
              <option value="Inorganic">Inorganic</option>
              <option value="Mixed">Mixed</option>
            </select>
            {errors.farmingType && <p className="error">{errors.farmingType.message}</p>}
          </div>

          <div className="viewform-row">
            <label>Livestock Owned <span className="required">*</span></label>
            <input {...register("livestock")} className="viweinput" />
            {errors.livestock && <p className="error">{errors.livestock.message}</p>}
          </div>
        </div>

        <div className="proposedform-columnright">
          <div className="viewform-row">
            <label>Farm Mechanization <span className="required">*</span></label>
            <select {...register("mechanization")} className="viweinput">
              <option value="">Select</option>
              <option value="Manual">Manual</option>
              <option value="Partially Mechanized">Partially Mechanized</option>
              <option value="Fully Mechanized">Fully Mechanized</option>
            </select>
            {errors.mechanization && <p className="error">{errors.mechanization.message}</p>}
          </div>

          <div className="viewform-row">
            <label>Other Occupation <span className="optional">(Optional)</span></label>
            <input {...register("otherOccupation")} className="viweinput" />
            {errors.otherOccupation && <p className="error">{errors.otherOccupation.message}</p>}
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
  <div className="step-container">

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
</FormProvider>

      </div>
    </div>
  );
};

export default ViewFarmer;
