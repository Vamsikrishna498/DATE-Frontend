import React, { useEffect, useState } from "react";
  import { useParams } from 'react-router-dom';
  import { useForm, FormProvider, Controller } from "react-hook-form";
  import { createFarmer, getFarmerById, updateFarmer } from "../api/apiService";
  import { useNavigate } from 'react-router-dom';
  import { yupResolver } from '@hookform/resolvers/yup';
  import Select from 'react-select';
  import axios from "axios";
  import * as yup from 'yup';
  import { parse, isValid, differenceInYears } from "date-fns";
  import farmImage from "../assets/farmImage.png";
  import "../styles/Farmerform.css";
 
 
    const stepSchemas = [
  // Step 0: Personal Information schema
     yup.object().shape({
     firstName: yup.string()
      .required("First Name is required")
      .matches(/^[A-Za-z]{2,26}$/, "First Name must be 2–26 letters only"),
     middleName: yup.string()
      .required("Middle Name is required")
      .matches(/^[A-Za-z]{1,26}$/, "Middle Name must contain only letters"),
     lastName: yup.string()
      .required("Last Name is required")
      .matches(/^[A-Za-z]{2,26}$/, "Last Name must be 2–26 letters only"),
     gender: yup.string().required("Gender is required"),
     salutation: yup.string()
      .required("Salutation is required")
      .oneOf(["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."], "Select a valid salutation"),
     nationality: yup.mixed()
      .required("Nationality is required")
      .transform((value) =>
        typeof value === "object" && value?.value ? value.value : value
      )
      .test("is-string", "Nationality must be a string", (value) => typeof value === "string"),
     dateOfBirth: yup.string()
      .required("Date of Birth is required")
      .test("age-range", "Age must be between 18 and 90 years", function (value) {
      if (!value) return false;
       const dob = new Date(value);
       const today = new Date();
       const age = today.getFullYear() - dob.getFullYear();
       const m = today.getMonth() - dob.getMonth();
       const isBirthdayPassed = m > 0 || (m === 0 && today.getDate() >= dob.getDate());
 
       const actualAge = isBirthdayPassed ? age : age - 1;
       return actualAge >= 18 && actualAge <= 90;
       }),
 
     fatherName: yup.string()
      .nullable()
      .notRequired()
      .matches(/^[A-Za-z\s]{2,40}$/, "Father Name must contain only letters"),
     alternativeNumber: yup.string()
      .nullable()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .matches(/^\d{10}$/, "Enter a valid 10-digit alternative number"),
     contactNumber: yup.string()
      .nullable()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .matches(/^\d{10}$/, "Enter a valid 10-digit contact number"),
     alternativeType: yup.string()
      .oneOf(["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse", "Other", ""], "Select a valid relation")
      .nullable()
      .notRequired(),
     photo: yup.mixed().nullable().notRequired(),
     }),
 
  // Step 1: Address
     yup.object().shape({
     country: yup.string().required("Country is required"),
     state: yup.string().required("State is required"),
     district: yup.string().required("District is required"),
     block: yup.string().required("Block is required"),
     village: yup.string().required("Village is required"),
     pincode: yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
     }),
 
  // Step 2: Professional Information
     yup.object().shape({
     education: yup.string().nullable(),
     experience: yup.string().nullable(),
     }),
 
  // Step 3: Current Crop Information
     yup.object().shape({
     surveyNumber: yup.string().nullable(),
     totalLandHolding: yup.string().nullable(),
     geoTag: yup.string().nullable(),
     selectCrop: yup.string().nullable(),
     netIncome: yup.string().nullable(),
     soilTest: yup.string().required("Soil test selection is required"),
     soilTestCertificate: yup.mixed().nullable().notRequired(),
     }),
 
  // Step 4: Proposed Crop Information
    yup.object().shape({
    surveyNumber: yup.string().nullable(),
    geoTag: yup.string().nullable(),
    cropType: yup.string().nullable(),
    totalLandHolding: yup.string().nullable(),
    netIncome: yup.string().nullable(),
    soilTest: yup.string().nullable(),
    soilTestCertificate: yup.mixed().nullable().notRequired(),
   }),
 
  // Step 5: Irrigation Details
    yup.object().shape({
    waterSource: yup.string().nullable(),
    borewellDischarge: yup.string().nullable(),
    summerDischarge: yup.string().nullable(),
    borewellLocation: yup.string().nullable(),
   }),
 
  // Step 6: Other Information (Bank)
    yup.object().shape({
    bankName: yup.string().nullable(),
    accountNumber: yup.string()
      .nullable()
      .matches(/^\d{9,18}$/, "Account Number must be 9-18 digits"),
    branchName: yup.string().nullable(),
    ifscCode: yup.string()
      .nullable()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC code"),
    passbookFile: yup.mixed()
      .nullable()
      .test("fileSize", "File is too large", value => !value || value.size <= 5 * 1024 * 1024)
      .test("fileType", "Unsupported file format", value =>
        !value || ["image/jpeg", "image/png", "application/pdf"].includes(value.type)),
     }),
 
  // Step 7: Documents
    yup.object().shape({
    voterId: yup.string().nullable(),
    aadharNumber: yup.string()
      .nullable()
      .matches(/^\d{12}$/, "Aadhar must be 12 digits"),
    panNumber: yup.string()
      .nullable()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter valid PAN number"),
    ppbNumber: yup.string().nullable(),
    passbookPhoto: yup.mixed()
      .nullable()
      .test("fileSize", "File too large", value => !value || value.size <= 10 * 1024 * 1024),
     }),
  ];
 
    const steps = ["Personal Information", "Address","Professional Information","Current Crop Information",
                  "Proposed Crop Information",  "Irrigation Details","Other Information", "Documents",];
 
    const FarmerForm = ({ currentStep, setCurrentStep, isEditMode }) => {
    console.log("Edit mode?", isEditMode);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedIrrigationTab, setSelectedIrrigationTab] = useState("current");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
 
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
 
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
 
  const [villages, setVillages] = useState([]);
 
  const [countryOptions, setCountryOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [mandalOptions, setMandalOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
 
    const totalSteps = steps.length;
    const [photoPreviewStep0, setPhotoPreviewStep0] = useState(null);
    const [photoPreviewStep3, setPhotoPreviewStep3] = useState(null);
   
    const handlePhotoChangeStep0 = (e) => {
    const file = e.target.files[0];
      if (file) {
      setPhotoPreviewStep0(URL.createObjectURL(file));
      setValue("photoStep0", file);
     }
    };
 
    const handlePhotoChangeStep3 = (e) => {
    const file = e.target.files[0];
     if (file) {
      setPhotoPreviewStep3(URL.createObjectURL(file));
      setValue("photoStep3", file);
     }
    };
 
    const cropOptions = {
      Grains: [ "Paddy", "Maize", "Red Gram", "Black Gram", "Bengal Gram", "Groundnut", "Green Gram", "Sweet Corn", ],
      Vegetables: [ "Dry Chilli", "Mirchi", "Tomato", "Ladies Finger", "Ridge Gourd", "Broad Beans", "Brinjal",
                "Cluster Beans", "Bitter Gourd", "Bottle Gourd", ],
      Cotton: ["Cotton"],
    };
 
    const [waterSourceCategory, setWaterSourceCategory] = useState("");
    const waterSourceOptions = ["Borewell", "Open Well", "Canal", "Tank", "River", "Drip"];
 
    const [cropCategory, setCropCategory] = useState("");
    const [cropCategoryStep3, setCropCategoryStep3] = useState("");
    const [cropCategoryStep4, setCropCategoryStep4] = useState("");
    const methods = useForm({
      resolver: yupResolver(stepSchemas[currentStep]),
       mode: "onChange",
    });
    const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset, trigger,} = useForm({
      resolver: yupResolver(stepSchemas[currentStep]),
      mode: "onChange",
    });
    const soilTestValue = watch("soilTest");
    console.log("Soil Test Value:", soilTestValue);
    const selectedDoc = watch("documentType");
    const navigate = useNavigate();
    const { farmerId } = useParams();
   
 
const onSubmit = async (data) => {
  const formData = new FormData();
  const farmerDto = { ...data };
 
  // Remove file fields from JSON
  delete farmerDto.photo;
  delete farmerDto.soilTestCertificate;
  delete farmerDto.aadhaarFile;
  delete farmerDto.panFile;
 
  formData.append(
    "farmerDto",
    new Blob([JSON.stringify(farmerDto)], { type: "application/json" })
  );
 
  // Append files conditionally
  if (data.photo?.[0]) formData.append("photo", data.photo[0]);
  if (data.soilTestCertificate?.[0]) formData.append("soilTestCertificate", data.soilTestCertificate[0]);
  if (data.aadhaarFile?.[0]) formData.append("aadhaarFile", data.aadhaarFile[0]);
  if (data.panFile?.[0]) formData.append("panFile", data.panFile[0]);
 
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in. Please log in to continue.");
    return;
  }
 
  try {
    let response;
 
    if (isEditMode) {
      response = await axios.put(
        `http://localhost:8080/api/farmers/${farmerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response = await axios.post(
        "http://localhost:8080/api/farmers",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }
 
    alert("✅ Farmer form submitted successfully!");
    const id = response.data.id || farmerId;
    navigate(`/view-farmer/${id}`);
  } catch (error) {
    console.error("❌ Submit Error:", error.response?.data || error.message);
    alert("❌ Failed to submit. Please try again.");
  }
};
 
 
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);
 
 useEffect(() => {
  axios.get("http://localhost:8080/api/auth/countries")
    .then((res) => {
      const formatted = res.data.map(c => ({ label: c.name, value: c.code }));
      setCountryOptions(formatted);
    })
    .catch((err) => console.error("Failed to fetch countries:", err));
}, []);
 
useEffect(() => {
  if (selectedCountry) {
    axios.get(`http://localhost:8080/api/auth/states/${selectedCountry}`)
      .then((res) => {
        const formatted = res.data.map(s => ({ label: s.name, value: s.code }));
        setStates(formatted);
      });
  } else {
    setStates([]);
  }
}, [selectedCountry]);
 
useEffect(() => {
  if (selectedState) {
    axios.get(`/api/districts?state=${selectedState}`)
      .then((res) => {
        const formatted = res.data.map(d => ({ label: d.name, value: d.code }));
        setDistrictOptions(formatted);
      });
  } else {
    setDistrictOptions([]);
  }
}, [selectedState]);
 
useEffect(() => {
  if (selectedDistrict) {
    axios.get(`/api/mandals?district=${selectedDistrict}`)
      .then((res) => {
        const formatted = res.data.map(m => ({ label: m.name, value: m.code }));
        setMandalOptions(formatted);
      });
  } else {
    setMandalOptions([]);
  }
}, [selectedDistrict]);
 
useEffect(() => {
  if (selectedMandal) {
    axios.get(`/api/villages?mandal=${selectedMandal}`)
      .then((res) => {
        const formatted = res.data.map(v => ({ label: v.name, value: v.code }));
        setVillages(formatted);
      });
  } else {
    setVillages([]);
  }
}, [selectedMandal]);
 
 
   
 
 
  return (
   
    <div className="farmer-wrapper">
           <div className="form-full">
        <FormProvider {...methods}>
           <form onSubmit={methods.handleSubmit(onSubmit)} className="farmer">
         
           {currentStep === 0 && (
  <div className="form-grid">
    <div className="field-left">
      {/* Photo Upload */}
      <div className="form-group photo-group">
        <label>Photo <span className="optional"></span></label>
        <div className="photo-box">
          {photoPreviewStep0 ? (
            <img src={photoPreviewStep0} alt="Preview" className="photo-preview" />
          ) : (
            <span className="photo-placeholder">No photo selected</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChangeStep0}
          className="photo-input"
        />
      </div>
 
          <label className="label">Salutation<span className="required">*</span></label>
      <select
        className="input"
        {...register("salutation", { required: "Salutation is required" })}
      >
        <option value="">Select</option>
        <option value="Mr.">Mr.</option>
        <option value="Mrs.">Mrs.</option>
        <option value="Ms.">Ms.</option>
        <option value="Miss.">Miss.</option>
        <option value="Dr.">Dr.</option>
      </select>
      {errors.salutation && <p className="error">{errors.salutation.message}</p>}
   
      <label className="label">First Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="First Name"
        {...register("firstName", { required: "First Name is required" })}
      />
      {errors.firstName && <p className="error">{errors.firstName.message}</p>}
 
     <label className="label">Middle Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Middle Name"
        {...register("middleName", { required: "Middle Name is required" })}
      />
      {errors.middleName && <p className="error">{errors.middleName.message}</p>}
 
      <label className="label">Last Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Last Name"
        {...register("lastName", { required: "Last Name is required" })}
      />
      {errors.lastName && <p className="error">{errors.lastName.message}</p>}
     </div>
 
    <div className="field-right">
     
       <label className="label">Gender<span className="required">*</span></label>
      <select
        className="input"
        {...register("gender", { required: "Gender is required" })}
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Transgender">Transgender</option>
      </select>
      {errors.gender && <p className="error">{errors.gender.message}</p>}
 
     <label className="label">Nationality<span className="required">*</span></label>
      <select
        className="input"
        {...register("nationality", { required: "Nationality is required" })}
      >
        <option value="">Select</option>
        <option value="Indian">Indian</option>
      </select>
      {errors.nationality && <p className="error">{errors.nationality.message}</p>}
 
         <label>Date of Birth  <span className="required">*</span></label>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  {...register("dateOfBirth")}
                />
                <p className="reg-error">{errors.dateOfBirth?.message}</p>
 
         <label>
        Contact Number <span className="optional"></span>
        <input type="tel" maxLength={10} {...register("contactNumber")} placeholder="10-digit number" />
      </label>
      <p className="error">{errors.contactNumber?.message}</p>
      <label>
 
        Father Name <span className="optional"></span>
        <input type="text" {...register("fatherName")} placeholder="Enter father's name" />
      </label>
      <p className="error">{errors.fatherName?.message}</p>
 
      <label>
        Alternative Type <span className="optional"></span>
        <select {...register("alternativeRelationType")}>
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
      </label>
      <p className="error">{errors.alternativeType?.message}</p>
 
      <label>
        Alternative Number <span className="optional"></span>
        <input type="tel" maxLength={10} {...register("alternativeContactNumber")} placeholder="10-digit number" />
      </label>
      <p className="error">{errors.alternativeNumber?.message}</p>
     
    </div>
  </div>
)}
 
 
      {currentStep === 1 && (
  <div className="address-field">
    {/* Country */}
<label>
 
  Country <span className="required">*</span>
</label>
<input
 
  type="text"
 
  {...register("country", { required: "Country is required" })}
 
  placeholder="Enter your country"
 
/>
<p className="error">{errors.country?.message}</p>
 
{/* State */}
<label>
 
  State <span className="required">*</span>
</label>
<input
 
  type="text"
 
  {...register("state", { required: "State is required" })}
 
  placeholder="Enter your state"
 
/>
<p className="error">{errors.state?.message}</p>
 
 
   <label>
  District <span className="required">*</span>
</label>
<input
  type="text"
  {...register("district", { required: "District is required" })}
  placeholder="Enter your district"
/>
<p className="error">{errors.district?.message}</p>
 
{/* Mandal */}
<label>
  Mandal <span className="required">*</span>
</label>
<input
  type="text"
  {...register("block", { required: "block is required" })}
  placeholder="Enter your block"
/>
<p className="error">{errors.mandal?.message}</p>
 
{/* Village */}
<label>
  Village <span className="required">*</span>
</label>
<input
  type="text"
  {...register("village", { required: "Village is required" })}
  placeholder="Enter your village"
/>
<p className="error">{errors.village?.message}</p>
 
    {/* Pincode */}
    <label>Pincode <span className="required">*</span></label>
    <input
      type="text"
      {...register("pincode", { required: "Pincode is required" })}
      placeholder="e.g. 500001"
    />
    <p className="error">{errors.pincode?.message}</p>
  </div>
)}
 
 
{currentStep === 2 && (
                <>
              <div className="profes-field">
                <label>Education <span className="optional"></span></label>
                <select {...register("education")}>
                  <option value="">Select</option>
                  <option value="Illiterate">Illiterate</option>
                  <option value="Primary Schooling">Primary Schooling</option>
                  <option value="High School">High School</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Degree">Degree</option>
                 </select>
                <p>{errors.occupation?.message}</p>
 
                <label>Experience <span className="optional"></span>
                  <input {...register("experience")} placeholder="e.g. 15 Years" />
                </label>
                <p>{errors.experience?.message}</p>
              </div>
              </>
            )}
 
            {currentStep === 3 && (
                <>
               <div className="current-field">
               
                   <div className="currentform-grid">
                   <div className="cropform-columnleft">
                   <div className="form-group photo-group">
                    <label>Photo <span className="optional"></span></label>
                    <div className="photo-box">
                    {photoPreviewStep3 ? (
                    <img src={photoPreviewStep3} alt="Preview" className="photo-preview" />
                          ) : (
                     <span className="photo-placeholder">No photo selected</span>
                    )}
                  </div>
                   <input
                      type="file"
                       accept="image/*"
                      onChange={handlePhotoChangeStep3}
                      className="photo-input"
                   />
                  </div>
                 
                    <label>Survey Numbers <span className="optional"></span>
                      <input {...register("surveyNumberStep3")} />
                    </label>
                    <p>{errors.surveyNumber?.message}</p>
 
                    <label>Total Land Holding (In Acres Nos) <span className="optional">(Optional)</span>
                     <input
                     type="number"
                     step="any"
                   {...register("totalLandHoldingStep3", {
                     valueAsNumber: true,
                      })}
                        />
                    </label>
                    <p>{errors.totalLandHolding?.message}</p>
 
                    <label>Geo-tag <span className="optional"></span>
                     <input {...register("geoTagStep3")} />
                    </label>
                    <p>{errors.geoTag?.message}</p>
                    </div>
 
                    <div className="cropform-columnright">
               
              <label>
                   Select Crop Category <span className="optional"></span>
              <select
                  value={cropCategoryStep3}
                  onChange={(e) => {
                 setCropCategoryStep3(e.target.value);
                 setValue("selectCropStep3", "");
                 }}
               >
                 <option value="">Select</option>
                 {Object.keys(cropOptions).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
                   ))}
               </select>
               </label>
 
          {cropCategoryStep3 && (
                <label>
                  Select Crop Name <span className="optional"></span>
                 <select {...register("selectCropStep3")} defaultValue="">
                 <option value="">Select</option>
                 {cropOptions[cropCategoryStep3].map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
                 ))}
               </select>
              </label>
              )}
              <p className="error">{errors.selectCropStep3?.message}</p>
 
                    <label>Net Income (As per Current Crop/Yr) <span className="optional"></span>
                     <input {...register("netIncomeStep3")} />
                    </label>
                    <p>{errors.netIncome?.message}</p>
 
                    <label>Soil Test <span className="optional"></span>
                    <select {...register("soilTest")}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    </label>
                    <p>{errors.soilTest?.message}</p>
 
                    <label>Soil Test Certificate
       <input type="file" {...register("soilTestCertificateStep3")} />
        {errors.soilTestCertificate && (
          <p className="error">{errors.soilTestCertificate.message}</p>
        )}
      </label>
                    </div>
                    </div>
                   
              </div>
              </>
            )}
     {currentStep === 4 && (
              <div className="proposed-field">
                 <div className="proposedform-grid">
                 <div className="proposedform-columnleft">
                <label>Survey Numbers <span className="optional"></span>
                 <input {...register("surveyNumberStep4")} />
                </label>
                <p>{errors.surveyNumber?.message}</p>
 
                <label>
                 Geo-tag <span className="optional">(Optional)</span>
                <input
                type="text"
                placeholder="Latitude, Longitude"
              {...register("geoTag", {
                pattern: {
                  value: /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/, // basic lat,lng pattern
                 message: "Enter valid Latitude, Longitude (e.g., 17.123, 78.456)"
                }
                })}
               />
              </label>
              <p className="error">{errors.geoTag?.message}</p>
 
 
               <label>
               Select Crop Category <span className="optional"></span>
               <select
               value={cropCategoryStep4}
               onChange={(e) => {
               setCropCategoryStep4(e.target.value);
               setValue("selectCropStep4", ""); // unique field name
               }}
               >
              <option value="">Select</option>
              {Object.keys(cropOptions).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              </label>
 
               {cropCategoryStep4 && (
              <label>
               Select Crop Name <span className="optional"></span>
               <select {...register("selectCropStep4")} defaultValue="">
               <option value="">Select</option>
                {cropOptions[cropCategoryStep4].map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
               </select>
              </label>
               )}
               <p className="error">{errors.selectCropStep4?.message}</p>
 
 
                <label>Soil Test <span className="optional"></span>
                <select {...register("soilTestStep4")}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                </label>
                <p>{errors.soilTest?.message}</p>
                </div>
 
                <div className="proposedform-columnright">
                <label>Total Land Holding (In Acres) <span className="optional"></span>
                <input
                     type="number"
                     step="any"
                   {...register("totalLandHoldingStep4", {
                     valueAsNumber: true,
                      })}
                        />
                </label>
                <p>{errors.totalLandHolding?.message}</p>
 
                <label>Net Income (Per Crop/Yr) <span className="optional"></span>
                <input type="text" {...register("netIncomeStep4")} />
                </label>
                <p className="error">{errors.netIncome?.message}</p>
 
                <label>Soil Test Certificate
                 <input type="file" {...register("soilTestCertificateStep4")} />
                   {errors.soilTestCertificate && (
                  <p className="error">{errors.soilTestCertificate.message}</p>
                   )}
                 </label>
                 </div>
                </div>
               </div>
      )}
         {currentStep === 5 && (
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
              <option key={source} value={source}>{source}</option>
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
          <input {...register("currentSummerDischarge")} />
        </label>
        <p className="error">{errors.summerDischarge?.message}</p>

        <label>
          Borewell location <span className="optional"></span>
          <input {...register("currentBorewellLocation")} />
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
              <option key={source} value={source}>{source}</option>
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
  </div>
)}
 
    {currentStep === 6 && (
                <div className="other-field">
                 <h3>Bank Details</h3>
 
                 <label>Bank Name <span className="optional"></span></label>
                <input type="text" {...register("bankName")} />
                <p className="error">{errors.bankName?.message}</p>
 
               <label>Account Number <span className="optional"></span></label>
                <input type="text" {...register("accountNumber")} />
                <p className="error">{errors.accountNumber?.message}</p>
 
               <label>Branch Name <span className="optional"></span></label>
                <input type="text" {...register("branchName")} />
              <p className="error">{errors.branchName?.message}</p>
     
              <label>IFSC Code <span className="optional"></span></label>
               <input type="text" {...register("ifscCode")} />
               <p className="error">{errors.ifscCode?.message}</p>
 
              <label>Passbook <span className="optional"></span></label>
             <input
             type="file"
             accept="image/*,application/pdf"
             onChange={(e) => {
             const file = e.target.files[0];
             setValue("passbookFile", file);
             trigger("passbookFile");
             }}
             />
             <p className="error">{errors.passbookFile?.message}</p>
             </div>
  )}
 
        {currentStep === 7 && (
          <div className="other-field">
       <label className="label">
          Add Document <span className="optional"></span>
       </label>
       <select className="docinput" {...register("documentType", { required: "Document Type is required" })}>
            <option value="">Select</option>
            <option value="voterId">ID/ Voter Card</option>
          <option value="aadharNumber">Aadhar Number</option>
           <option value="panNumber">Pan Number</option>
         <option value="ppbNumber">PPB Number</option>
          </select>
          <p>{errors.documentType?.message}</p>
 
 
         {selectedDoc === "voterId" && (
         <>
    <input
      type="text"
      placeholder="Voter ID"
      className="input"
      {...register("voterId", { required: "Voter ID is required" })}
    />
    <p>{errors.voterId?.message}</p>
 
    <input
      type="file"
      accept="image/*,application/pdf"
      {...register("voterFile", { required: "Voter ID File is required" })}
    />
    <p>{errors.voterFile?.message}</p>
   </>
  )}
 
       {selectedDoc === "aadharNumber" && (
        <>
     <input
       type="text"
       placeholder="Aadhar Number"
       {...register("aadharNumber", {
        required: "Aadhar Number is required"
       })}
     />
     <p>{errors.aadharNumber?.message}</p>
 
      <input
        type="file"
        {...register("aadharFile", {
        required: "Aadhar File is required"
        })}
      />
       <p>{errors.aadharFile?.message}</p>
    </>
     )}
 
 
      {selectedDoc === "panNumber" && (
    <>
    <input   type="text"   placeholder="PAN Number" className="input"
      {...register("panNumber", { required: "PAN Number is required" })}  />
     <p>{errors.panNumber?.message}</p>
 
    <input  type="file"   accept="image/*,application/pdf"
      {...register("panFile", { required: "PAN File is required" })} />
      <p>{errors.panFile?.message}</p>
      </>
    )}
        <input   type="text"  placeholder="PPB Number" className="input" {...register("ppbNumber")} />
      <p>{errors.ppbNumber?.message}</p>
 
       <input  type="file" accept="image/*,application/pdf" {...register("ppbFile")} />
        <p>{errors.ppbFile?.message} </p>
          </div>
                )}
             <div className="btn-group">
  {currentStep === 0 ? (
    <button
      type="button"
      onClick={async () => {
        const isValid = await trigger();
        if (isValid) setCurrentStep(currentStep + 1);
      }}
    >
      Next
    </button>
  ) : currentStep === totalSteps - 1 ? (
    <>
      <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
        Previous
      </button>
      <button
        type="button"
        onClick={async () => {
          const isValid = await trigger();
          if (isValid) {
            await handleSubmit(onSubmit)();
          }
        }}
      >
        Submit
      </button>
    </>
  ) : (
    <>
      <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
        Previous
      </button>
      <button
        type="button"
        onClick={async () => {
          const isValid = await trigger();
          if (isValid) setCurrentStep(currentStep + 1);
        }}
      >
        Next
      </button>
    </>
  )}
</div>
 
 
 
          </form>
        </FormProvider>
      </div>
      <div className="form-right">
        <img src={farmImage} alt="Farm Field" className="form-image" />
      </div>
    </div>
  );
};
  export default FarmerForm;