import React, { useState, useEffect } from "react";
import { useForm, FormProvider, } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as Yup from 'yup';
import sampleImage from "../assets/tractor.png";
import logo1 from "../assets/leftlogo.png";
import logo2 from "../assets/rightlogo.png";
import "../styles/EmployeeDetails.css";

function EmployeeDetails() {
  const steps = [
    "🏛️ Employee Details",
    "🔍  Contact Details",
    "👨‍🌾 Other Details",
    "📌 Adress",
    "👨‍🌾 Professional Details",
    "💧 Bank Details",
    "📄 Documents",
    "Portal Access",
    
    
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const methods = useForm();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    setShowSuccessPopup(true);
  };

  const [photoPreview, setPhotoPreview] = useState(null);

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPhotoPreview(URL.createObjectURL(file));
  }
};

const API_BASE_URL = "https://your-api.com/api/employees";

const submitStepData = async (stepData, stepIndex) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/step${stepIndex + 1}`, stepData);
    console.log(`Step ${stepIndex + 1} submitted:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in step ${stepIndex + 1}:`, error.response?.data || error.message);
    throw error;
  }
};

const [countries, setCountries] = useState([]);
 const states = [{ id: 1, name: 'Andrapradesh' }, { id: 2, name: 'Telangana' },{ id: 3, name: 'Karnataka' },{ id: 4, name: 'Tamilnadu' } ];
    const districts = [{ id: 1, name: "Adilabad" }, { id: 2, name: "Bhadradri Kothagudem" },{ id: 3, name: "Hyderabad"},
      { id: 4, name:  "Khammam"},{ id: 5, name: "Jayashankar Bhupalpally"},{ id: 6, name: "Jangaon"},{ id: 7, name: "Jagtial"},
      { id: 8, name: "Komaram Bheem Asifabad"},{ id: 9, name: "Karimnagar"},{ id: 10, name: "Kamareddy"},{ id: 11, name: "Jogulamba Gadwal"},
      { id: 12, name: "Mahabubabad"},{ id: 13, name: "Mahabubnagar"},{ id: 14, name: "Medchal–Malkajgiri"},{ id: 15, name: "Nizamabad"},
      { id: 16, name: "Mancherial"},{ id: 17, name: "Medak"},{ id: 18, name: "Mulugu"},{ id: 19, name: "Peddapalli"},
      { id: 20, name: "Nagarkurnool"},{ id: 21, name: "Nalgonda"},{ id: 22, name: "Nirmal"},{ id: 23, name: "Rajanna Sircilla"},
      { id: 24, name:"Ranga Reddy"},{ id: 25, name:  "Sangareddy"},{ id: 26, name: "Siddipet"},{ id: 27, name: "Suryapet"},
      { id: 28, name:  "Warangal Urban"},{ id: 29, name:  "Warangal Rural"},{ id: 30, name:  "Wanaparthy"},{ id: 31, name:  "Vikarabad"},
      { id: 32, name:  "Yadadri Bhuvanagiri"}];
    const blocks = [ { id: 1, districtId: 1, name: "Adilabad" }, { id: 2, districtId: 1, name: "Bela" },{ id: 3, districtId: 1, name: "Boath" },
      { id: 4, districtId: 1, name: "Gudihatnoor" }, { id: 5, districtId: 1, name: "Indervelly" },{ id: 6, districtId: 2, name: "Bhadrachalam" },
      { id: 7, districtId: 2, name: "Aswapuram" }, { id: 8, districtId: 2, name: "Burgampahad" },{ id: 9, districtId: 2, name: "Dummugudem" },
      { id: 10, districtId: 2, name: "Manuguru" }, { id: 11, districtId: 3, name: "Amberpet" },{ id: 12, districtId: 3, name: "Ameerpet" },
      { id: 13, districtId: 3, name: "Asifnagar" },{ id: 14, districtId: 3, name: "Bahadurpura" },{ id: 15, districtId: 3, name: "Bandlaguda" },
      { id: 16, districtId: 3, name: "Golconda" },  { id: 17, districtId: 4, name: "Khammam Urban" },{ id: 18, districtId: 4, name: "Khammam Rural" },
      { id: 19, districtId: 4, name: "Nelakondapally" },{ id: 20, districtId: 4, name: "Mudigonda" },{ id: 21, districtId: 4, name: "Raghunathapalem" },
      { id: 22, districtId: 5, name: "Bhupalpally" },{ id: 23, districtId: 5, name: "Chityal" }, { id: 24, districtId: 5, name: "Ghanpur" },
      { id: 25, districtId: 5, name: "Maha Mutharam" }, { id: 26, districtId: 5, name: "Mogullapalle" },{ id: 27, districtId: 6, name: "Jangaon" },
      { id: 28, districtId: 6, name: "Lingalaghanpur" },{ id: 29, districtId: 6, name: "Raghunathpalle" }, { id: 30, districtId: 6, name: "Gundala" },
      { id: 31, districtId: 6, name: "Narmetta" }, { id: 32, districtId: 7, name: "Jagtial" },{ id: 33, districtId: 7, name: "Gollapalli" },
      { id: 34, districtId: 7, name: "Pegadapalli" }, { id: 35, districtId: 7, name: "Mallial" },     { id: 36, districtId: 8, name: "Asifabad" },
      { id: 37, districtId: 8, name: "Kerameri" },{ id: 38, districtId: 8, name: "Jainoor" },{ id: 39, districtId: 8, name: "Sirpur (U)" },
      { id: 40, districtId: 9, name: "Karimnagar" },{ id: 41, districtId: 9, name: "Choppadandi" },{ id: 42, districtId: 9, name: "Gangadhara" },
      { id: 43, districtId: 10, name: "Kamareddy" }, { id: 44, districtId: 10, name: "Banswada" },{ id: 45, districtId: 10, name: "Bhiknoor" },
      { id: 46, districtId: 11, name: "Gadwal" },{ id: 47, districtId: 11, name: "Alampur" },{ id: 48, districtId: 11, name: "Itikyal" },
      { id: 49, districtId: 12, name: "Mahabubabad" },{ id: 50, districtId: 12, name: "Bayyaram" },{ id: 51, districtId: 12, name: "Maripeda" },
      { id: 52, districtId: 13, name: "Mahabubnagar" }, { id: 53, districtId: 13, name: "Bhoothpur" }, { id: 54, districtId: 13, name: "Ghanpur" },
      { id: 55, districtId: 14, name: "Alwal" }, { id: 56, districtId: 14, name: "Bachupally" },{ id: 57, districtId: 14, name: "Kukatpally" },
      { id: 58, districtId: 15, name: "Armur" },{ id: 59, districtId: 15, name: "Balkonda" }, { id: 60, districtId: 15, name: "Bheemgal" },
      { id: 61, districtId: 15, name: "Jakranpalle" },{ id: 62, districtId: 16, name: "Mancherial" },{ id: 63, districtId: 16, name: "Dandepalli" },
      { id: 64, districtId: 16, name: "Luxettipet" }, { id: 65, districtId: 17, name: "Medak" },{ id: 66, districtId: 17, name: "Havelighanpur" },
      { id: 67, districtId: 17, name: "Papannapet" },{ id: 68, districtId: 18, name: "Mulugu" },{ id: 69, districtId: 18, name: "Venkatapur" },
      { id: 70, districtId: 19, name: "Peddapalli" },{ id: 71, districtId: 19, name: "Manthani" },{ id: 72, districtId: 20, name: "Nagarkurnool" },
      { id: 73, districtId: 20, name: "Achampet" },{ id: 74, districtId: 21, name: "Nalgonda" },{ id: 75, districtId: 21, name: "Chityal" },
      { id: 76, districtId: 22, name: "Nirmal" },{ id: 77, districtId: 22, name: "Dilawarpur" },{ id: 78, districtId: 23, name: "Sircilla" }, 
      { id: 79, districtId: 23, name: "Vemulawada" }, { id: 80, districtId: 24, name: "Ibrahimpatnam" },{ id: 81, districtId: 24, name: "Chevella" },
      { id: 82, districtId: 25, name: "Sangareddy" }, { id: 83, districtId: 25, name: "Patancheru" }, { id: 84, districtId: 26, name: "Siddipet" },
      { id: 85, districtId: 26, name: "Dubbak" },{ id: 86, districtId: 27, name: "Suryapet" },{ id: 87, districtId: 27, name: "Kodad" },
      { id: 88, districtId: 28, name: "Hanamkonda" }, { id: 89, districtId: 28, name: "Kazipet" }, { id: 90, districtId: 29, name: "Wardhannapet" },
      { id: 91, districtId: 29, name: "Parvathagiri" },{ id: 92, districtId: 30, name: "Wanaparthy" }, { id: 93, districtId: 30, name: "Gopalpeta" },
      { id: 94, districtId: 31, name: "Vikarabad" },{ id: 95, districtId: 31, name: "Tandur" },{ id: 96, districtId: 32, name: "Bhuvanagiri" },
      { id: 97, districtId: 32, name: "Motakondur" }
     ];
    
    const villages = [
      { id: 1, districtId: 1, blockId: 1, name: "Adilabad Village" }, { id: 2, districtId: 1, blockId: 2, name: "Bela Village" },
      { id: 3, districtId: 1, blockId: 3, name: "Boath Village" }, { id: 4, districtId: 2, blockId: 6, name: "Bhadrachalam Village" },
      { id: 5, districtId: 2, blockId: 7, name: "Aswapuram Village" }, { id: 6, districtId: 2, blockId: 8, name: "Burgampahad Village" }, 
      { id: 7, districtId: 3, blockId: 11, name: "Amberpet Village" },{ id: 8, districtId: 3, blockId: 12, name: "Ameerpet Village" },
      { id: 9, districtId: 3, blockId: 13, name: "Asifnagar Village" }, { id: 10, districtId: 4, blockId: 17, name: "Khammam Urban Village" },
      { id: 11, districtId: 4, blockId: 18, name: "Khammam Rural Village" }, { id: 12, districtId: 4, blockId: 19, name: "Nelakondapally Village" },
      { id: 13, districtId: 5, blockId: 22, name: "Bhupalpally Village" },{ id: 14, districtId: 5, blockId: 23, name: "Chityal Village" },
      { id: 15, districtId: 5, blockId: 24, name: "Ghanpur Village" }, { id: 16, districtId: 6, blockId: 27, name: "Jangaon Village" },
      { id: 17, districtId: 6, blockId: 28, name: "Lingalaghanpur Village" }, { id: 18, districtId: 6, blockId: 29, name: "Raghunathpalle Village" },
      { id: 19, districtId: 7, blockId: 32, name: "Jagtial Village" }, { id: 20, districtId: 7, blockId: 33, name: "Gollapalli Village" },
      { id: 21, districtId: 7, blockId: 34, name: "Pegadapalli Village" }, { id: 22, districtId: 8, blockId: 36, name: "Asifabad Village" },
      { id: 23, districtId: 8, blockId: 37, name: "Kerameri Village" },{ id: 24, districtId: 8, blockId: 38, name: "Jainoor Village" },
      { id: 25, districtId: 9, blockId: 40, name: "Karimnagar Village" }, { id: 26, districtId: 9, blockId: 41, name: "Choppadandi Village" },
      { id: 27, districtId: 9, blockId: 42, name: "Gangadhara Village" },{ id: 28, districtId: 10, blockId: 43, name: "Kamareddy Village" },
      { id: 29, districtId: 10, blockId: 44, name: "Banswada Village" }, { id: 30, districtId: 10, blockId: 45, name: "Bhiknoor Village" },
      { id: 31, districtId: 11, blockId: 46, name: "Gadwal Village" }, { id: 32, districtId: 11, blockId: 47, name: "Alampur Village" },
      { id: 33, districtId: 11, blockId: 48, name: "Itikyal Village" }, { id: 34, districtId: 12, blockId: 49, name: "Mahabubabad Village" },
      { id: 35, districtId: 12, blockId: 50, name: "Bayyaram Village" },{ id: 36, districtId: 12, blockId: 51, name: "Maripeda Village" },
      { id: 37, districtId: 13, blockId: 52, name: "Mahabubnagar Village" },{ id: 38, districtId: 13, blockId: 53, name: "Bhoothpur Village" },
      { id: 39, districtId: 13, blockId: 54, name: "Ghanpur Village" },{ id: 40, districtId: 14, blockId: 55, name: "Alwal Village" },
      { id: 41, districtId: 14, blockId: 56, name: "Bachupally Village" },{ id: 42, districtId: 14, blockId: 57, name: "Kukatpally Village" },
      { id: 43, districtId: 15, blockId: 58, name: "Armur Village" },{ id: 44, districtId: 15, blockId: 59, name: "Balkonda Village" },
      { id: 45, districtId: 15, blockId: 60, name: "Bheemgal Village" }, { id: 46, districtId: 16, blockId: 62, name: "Mancherial Village" },
      { id: 47, districtId: 16, blockId: 63, name: "Dandepalli Village" },{ id: 48, districtId: 16, blockId: 64, name: "Luxettipet Village" },
      { id: 49, districtId: 17, blockId: 65, name: "Medak Village" },{ id: 50, districtId: 17, blockId: 66, name: "Havelighanpur Village" },
      { id: 51, districtId: 17, blockId: 67, name: "Papannapet Village" },{ id: 52, districtId: 18, blockId: 68, name: "Mulugu Village" },
      { id: 53, districtId: 18, blockId: 69, name: "Venkatapur Village" },{ id: 54, districtId: 19, blockId: 70, name: "Peddapalli Village" },
      { id: 55, districtId: 19, blockId: 71, name: "Manthani Village" },{ id: 56, districtId: 20, blockId: 72, name: "Nagarkurnool Village" },
      { id: 57, districtId: 20, blockId: 73, name: "Achampet Village" }, { id: 58, districtId: 21, blockId: 74, name: "Nalgonda Village" },
      { id: 59, districtId: 21, blockId: 75, name: "Chityal Village" },{ id: 60, districtId: 22, blockId: 76, name: "Nirmal Village" },
      { id: 61, districtId: 22, blockId: 77, name: "Dilawarpur Village" },{ id: 62, districtId: 23, blockId: 78, name: "Sircilla Village" },
      { id: 63, districtId: 23, blockId: 79, name: "Vemulawada Village" },{ id: 64, districtId: 24, blockId: 80, name: "Ibrahimpatnam Village" },
     
  ];

const country = watch("address.country");
const state = watch("address.state");
const district = watch("address.district");
const block = watch("address.block");

const addressSchema = Yup.object().shape({
    address: Yup.object().shape({
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      district: Yup.string().required('District is required'),
      block: Yup.string().required('Block (mandal) is required'),
      village: Yup.string().required('Village is required'),
      zipcode: Yup.string()
        .required('Zipcode is required')
        .matches(/^[0-9]{6}$/, 'Zipcode must be 6 digits'),
    }),
  });



  return (
    <div className="employee-container">
      <header className="employeetop-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>

      <div className="employeemiddle-container">
        <nav className="employeenav-links">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`employeenav-item ${index === currentStep ? "active" : ""}`}
              onClick={() => setCurrentStep(index)}
              style={{ cursor: "pointer" }}
            >
              {label}
            </div>
          ))}
        </nav>
      </div>
         <u><h2 className="form-title">
          {steps[currentStep].replace(/^[^\w]+/, "").trim()}
         </h2></u>
      <div className="main-content">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
            {currentStep === 0 && (
  <div className="employeeform-grid">
    <div className="frame-photo">
  <label className="label">
    Photo <span className="optional">(Optional)</span>
  </label>
  <div className="photo-box">
    {photoPreview ? (
      <img src={photoPreview} alt="Preview" className="photo-preview" />
    ) : (
      "Photo"
    )}
  </div>
  
 <div>
  <input
    type="file"
    accept="image/*"
    {...register("photo")}
    onChange={(e) => {
      handlePhotoChange(e);
      // Keep react-hook-form handling
      register("photo").onChange(e);
    }}
    className="input"
  />

  {errors.photo && <p className="error">{errors.photo.message}</p>}
  </div>
  </div>

    {/* Gender */}
    <div>
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
    </div>

    {/* First Name */}
    <div>
      <label className="label">First Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="First Name"
        {...register("firstName", { required: "First Name is required" })}
      />
      {errors.firstName && <p className="error">{errors.firstName.message}</p>}
    </div>

    {/* Salutation */}
    <div>
      <label className="label">Salutation<span className="required">*</span></label>
      <select
        className="input"
        {...register("salutation", { required: "Salutation is required" })}
      >
        <option value="">Select</option>
        <option value="Mr">Mr</option>
        <option value="Mrs.">Mrs.</option>
        <option value="Ms.">Ms.</option>
        <option value="Miss.">Miss.</option>
        <option value="Dr.">Dr.</option>
      </select>
      {errors.salutation && <p className="error">{errors.salutation.message}</p>}
    </div>

    {/* Middle Name */}
    <div>
      <label className="label">Middle Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Middle Name"
        {...register("middleName", { required: "Middle Name is required" })}
      />
      {errors.middleName && <p className="error">{errors.middleName.message}</p>}
    </div>

    {/* Nationality */}
    <div>
      <label className="label">Nationality<span className="required">*</span></label>
      <select
        className="input"
        {...register("nationality", { required: "Nationality is required" })}
      >
        <option value="">Select</option>
        <option value="Indian">Indian</option>
      </select>
      {errors.nationality && <p className="error">{errors.nationality.message}</p>}
    </div>

    {/* Last Name */}
    <div>
      <label className="label">Last Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Last Name"
        {...register("lastName", { required: "Last Name is required" })}
      />
      {errors.lastName && <p className="error">{errors.lastName.message}</p>}
    </div>

    {/* DOB */}
    <div>
      <label className="label">DOB<span className="required">*</span></label>
      <input
        type="date"
        className="input"
        {...register("dob", { required: "Date of Birth is required" })}
      />
      {errors.dob && <p className="error">{errors.dob.message}</p>}
    </div>
  </div>
)}
            {/* Step 1: Contact Details */}
            {currentStep === 1 && (
              <div className="form-one">
                <div>
                <label className="label">Contact Number
                    <span className="required">*</span></label>
                  <input
                    type="text"
                     className="input"
                    {...register("contactNumber", {
                      required: "Contact Number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    })}
                    placeholder=""
                  />
                  <p className="error">{errors.contactNumber?.message}</p>
                </div>

                <div>
                <label className="label"> Email
                 <span className="required">*</span></label>
                  <input
                    type="email"
                    className="input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder=""
                  />
                  <p className="error">{errors.email?.message}</p>
                </div>
              </div>
            )}

{currentStep === 2 && (
  <div className="form-two">
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


    <div>
      <label className="label">Father Name</label>
      <input
        type="text"
        placeholder="Krishna Kumar"
        className="input"
        {...register("fatherName")}
      />
    </div>

    <div>
      <label className="label">Alternative Number</label>
      <input
        type="text"
        placeholder="91-987xxxxxx16"
        className="input"
        {...register("altNumber")}
      />
    </div>

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
)}

{currentStep === 3 && (
        <div className="form-three">
         <div>
            <label> Country <span className="required">*</span></label>
            <select {...register("address.country")} className="input">
              <option value="">Select Country</option>
              {countries.map((countries) => ( <option key={countries.id} value={countries.name}> {countries.name}  </option> ))}
            </select>
            <p className="error">{errors.address?.country?.message}</p>
          </div>

          <div>
            <label className="label">State <span className="required">*</span></label>
            <select {...register("address.state")} className="input">
              <option value="">Select State</option>
              {states.map((state) => ( <option key={state.id} value={state.name}> {state.name}  </option> ))}
            </select>
            <p className="error">{errors.address?.state?.message}</p>
          </div>

          <div>
            <label className="label">District <span className="required">*</span></label>
            <select {...register("address.district")} className="input">
              <option value="">Select District</option>
              {districts.map((districts) => ( <option key={districts.id} value={districts.name}> {districts.name}  </option> ))}
            </select>
            <p className="error">{errors.address?.district?.message}</p>
          </div>

          <div>
            <label className="label">Block (mandal) <span className="required">*</span></label>
            <select {...register("address.block")} className="input">
              <option value="">Select Block</option>
              {blocks.map((blocks) => ( <option key={blocks.id} value={blocks.name}> {blocks.name}  </option> ))}
            </select>
            <p className="error">{errors.address?.block?.message}</p>
          </div>

          <div>
            <label className="label">Village <span className="required">*</span></label>
            <select {...register("address.village")} className="input">
              <option value="">Select Village</option>
              {villages.map((villages) => ( <option key={villages.id} value={villages.name}> {villages.name}  </option> ))}
            </select>
            <p className="error">{errors.address?.village?.message}</p>
          </div>

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
      )}


{currentStep === 4 && (
  <div className="form-four">
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

    <div>
      <label className="label">Experience</label>
      <input
        type="text"
        placeholder="15 Years"
        className="input"
        {...register("professional.experience")}
      />
    </div>
  </div>
)}

{currentStep === 5 && (
  <div className="form-five">
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
      <label className="label">Branch name</label>
      <input
        type="text"
        placeholder="Madhapur"
        className="input"
        {...register("bank.branchName")}
      />
    </div>

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
        {...register("bank.passbook")}
      />
    </div>
  </div>
)}

{currentStep === 6 && (
  <div className="form-six">
    <div>
      <label className="label">Add Document</label>
      <select className="input" {...register("documents.documentType")}>
        <option value="">Select</option>
        <option value="voter">ID/ Voter Card</option>
        <option value="aadhar">Aadhar Number</option>
        <option value="pan">PAN Number</option>
      </select>
    </div>

    <div>
      <label className="label">Upload</label>
      <input
        type="file"
        className="input"
        {...register("documents.file")}
      />
    </div>
  </div>
)}

{currentStep === 7 && (
  <div className="form-seven">
    <div>
      <label className="label">
        Role/Designation <span className="required">*</span>
      </label>
      <select className="input" {...register("portalAccess.role", { required: true })}>
        <option value="">Select</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </select>
    </div>

    <div>
      <label className="label">
        Access <span className="required">*</span>
      </label>
      <select className="input" {...register("portalAccess.status", { required: true })}>
        <option value="">Select</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  </div>
)}


            {/* TODO: Add Steps 2 - 6 here */}

            <div className="employee-btn">
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
                  <button type="submit">Submit</button>
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

            {showSuccessPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h3>Success!</h3>
                  Employee form submitted successfully.
                  <button onClick={() => setShowSuccessPopup(false)}>OK</button>
                </div>
              </div>
            )}
          </form>
        </FormProvider>

        {/* Right: Image Section */}
        <div className="image-section">
          <img src={sampleImage} alt="Tractor" />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;

