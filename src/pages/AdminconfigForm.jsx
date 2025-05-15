import React, { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Routes, Route } from "react-router-dom";
import Select from 'react-select';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import adminImage from "../assets/admin.png";
import logo1 from "../assets/leftlogo.png";
import logo2 from "../assets/rightlogo.png";
import "../styles/AdminconfigForm.css"

function Adminmiddlebar({ steps, openDropdownIndex, handleDropdownToggle, handleChildSelect }) {
  return (
    <nav className="adminnav-links">
      {steps.map((step, index) => (
        <div key={index} className="adminnav-item">
          {step.children ? (
            <>
              <div
                onClick={() => handleDropdownToggle(index)}
                className={`adminnav-dropdown-toggle ${openDropdownIndex === index ? "open" : ""}`}
              >
                {step.label}
              </div>
              {openDropdownIndex === index && (
                <div className="adminnav-dropdown">
                  {step.children.map((child, childIndex) => (
                    <button
                      key={childIndex}
                      className="adminnav-subitem"
                      onClick={() => handleChildSelect(child.label)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="adminnav-item-link">{step.label}</div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function AdminconfigForm() {
  const steps = [
    {
      label: "🏛️ User & Roles",
     children: [
        { label: "🏛️ Role" },
        { label: "👤 User" },
      ],
    },
    {
      label: "🔍 Personalization",
      children: [
        { label: "🧑‍🌾 Farmer Code", path: "/personalization/farmer-code" },
        { label: "👥 Employee Code", path: "/personalization/employee-code" },
        { label: "📧 Mail Templates", path: "/personalization/mail-templates" },
        { label: "📱 SMS Templates", path: "/personalization/sms-templates" },
      ],
    },
    { label: "⚙️ Settings",
      children: [
        { label: "🌍 Country Settings", path: "/settings/country-settings" },
        { label: "🌍 Global Area", path: "/settings/global-area" },
        { label: "🌱 Crop Settings", path: "/settings/crop-settings" },
      ],
    },
    { label: "📌 Preferences" },
    
  ];

  const methods = useForm();
  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    formState: { errors },
  } = methods;

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedChild, setSelectedChild] = useState("Role"); // default view

  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleChildSelect = (label) => {
    setSelectedChild(label);
    setOpenDropdownIndex(null); // close dropdown after selection
  };

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    alert(`${selectedChild} form submitted successfully!`);
  };

  const moduleOptions = [
    
    { value: "employee", label: "Employee" },
    { value: "farmer", label: "Farmer" },
  ];

  const accessOptions = [
    { value: "add", label: "Add" },
    { value: "read", label: "View" },
    { value: "write", label: "Edit" },
    { value: "delete", label: "Delete" },
  ];
  const childOrder = [
    "👤 User",
    "🏛️ Role",
    "🧑‍🌾 Farmer Code",
    "👥 Employee Code",
    "📧 Mail Templates",
    "📱 SMS Templates",
    "🌍 Country Settings",
    "🌍 Global Area",
    "🌱 Crop Settings"
  ];
  function handlePrevious() {
    const currentIndex = childOrder.indexOf(selectedChild);
    if (currentIndex > 0) {
      handleChildSelect(childOrder[currentIndex - 1]);
    }
  }
  
  function handleNext() {
    const currentIndex = childOrder.indexOf(selectedChild);
    if (currentIndex < childOrder.length - 1) {
      handleChildSelect(childOrder[currentIndex + 1]);
    }
  }

  return (
    <div className="admin-container">
      <header className="admintop-bar">
          <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
          <img src={logo2} alt="DATE Logo" className="infologo-right" />
        </header>
      <div className="adminmiddle-container">
        <Adminmiddlebar
          steps={steps}
          openDropdownIndex={openDropdownIndex}
          handleDropdownToggle={handleDropdownToggle}
          handleChildSelect={handleChildSelect}
        />
      </div>

      <div className="main-content">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
            {selectedChild === "🏛️ Role" && (
              <div className="adminform-section">
                <h2>Role Form</h2>
                <label>Role Name *</label>
                <div className="flex-row">
                  <label>
                    <input type="radio" value="Manager" {...register("role", { required: true })} /> Manager
                  </label>
                  <label>
                    <input type="radio" value="Employee" {...register("role", { required: true })} /> Employee
                  </label>
                </div>
                {errors.role && <p className="error">Role is required</p>}

                <label>Description *</label>
                <textarea {...register("description", { required: true })} />
                {errors.description && <p className="error">Description is required</p>}

                <label>Select Modules *</label>
                <Controller
                  name="modules"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} options={moduleOptions} isMulti placeholder="Mltiselect Modules" />
                  )}
                />
                {errors.modules && <p className="error">Modules are required</p>}

                <label>Define Access *</label>
                <Controller
                  name="access"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} options={accessOptions} isMulti placeholder="Select Access" />
                  )}
                />
                {errors.access && <p className="error">Access is required</p>}

                 <div className="admin-btn">
                <button type="submit">Next</button>
              </div>
              </div>
            )}

            {selectedChild === "👤 User" && (
              <div className="adminform-section">
                <h2>User Form</h2>
                <label>User Name *</label>
                <input type="text" {...register("username", { required: true })} />
                {errors.username && <p className="error">User Name is required</p>}

                <label>Email *</label>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <p className="error">Email is required</p>}

                <label>Assign Role *</label>
                <Controller
                  name="assignedRole"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} options={[{ value: "manager", label: "Manager" }, { value: "employee", label: "Employee" }]} placeholder="Select Role" />
                  )}
                />
                {errors.assignedRole && <p className="error">Role is required</p>}

                <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
              </div>
            )}

{selectedChild === "🧑‍🌾 Farmer Code" && (
  <div className="adminform-section">
    <h2>Farmer Code </h2>

    <label>Prefix *</label>
    <input type="text" {...register("farmerPrefix", { required: true })} />
    {errors.farmerPrefix && <p className="error">Prefix is required</p>}

   

    <label>Starting Number *</label>
    <input type="number" {...register("farmerStart", { required: true })} />
    {errors.farmerStart && <p className="error">Starting number is required</p>}

    <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
  </div>
)}

{selectedChild === "👥 Employee Code" && (
  <div className="adminform-section">
    <h2>Employee Code </h2>

    <label>Prefix *</label>
    <input type="text" {...register("employeePrefix", { required: true })} />
    {errors.employeePrefix && <p className="error">Prefix is required</p>}

    

    <label>Starting Number *</label>
    <input type="number" {...register("employeeStart", { required: true })} />
    {errors.employeeStart && <p className="error">Starting number is required</p>}

    <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
  </div>
)}

{selectedChild === "📧 Mail Templates" && (
  <div className="adminform-section">
    <h2>Mail Templates</h2>

    <label>Template Name *</label>
    <input type="text" {...register("mailTemplateName", { required: true })} />
    {errors.mailTemplateName && <p className="error">Template name is required</p>}

    <label>Subject *</label>
    <input type="text" {...register("mailSubject", { required: true })} />
    {errors.mailSubject && <p className="error">Subject is required</p>}

    <label>Body *</label>
    <textarea {...register("mailBody", { required: true })} />
    {errors.mailBody && <p className="error">Body is required</p>}

    <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
  </div>
)}

{selectedChild === "📱 SMS Templates" && (
  <div className="adminform-section">
    <h2>SMS Templates</h2>

    <label>Template Name *</label>
    <input type="text" {...register("smsTemplateName", { required: true })} />
    {errors.smsTemplateName && <p className="error">Template name is required</p>}

    <label>Message *</label>
    <textarea {...register("smsMessage", { required: true })} />
    {errors.smsMessage && <p className="error">Message is required</p>}

    <div className="admin-btn">
  <button type="button" onClick={handlePrevious}>Previous</button>
  <button type="button" onClick={handleNext}>Next</button>
</div>
  </div>
)}
           {selectedChild === "🌍 Country Settings" && (
  <div className="adminform-section">
    <h2>Country Settings</h2>

    {/* Country */}
    <label>Country *</label>
    <select {...register("country", { required: true })}>
      <option value="">Add Country</option>
      <option value="India">India</option>
      <option value="USA">USA</option>
    </select>
    {errors.country && <p className="error">Country is required</p>}

    {/* State */}
    <label>State *</label>
    <select {...register("state", { required: true })} disabled={!watch("country")}>
      <option value="">Map State to Country</option>
      {watch("country") === "India" && (
        <>
          <option value="Karnataka">Karnataka</option>
          <option value="Maharashtra">Maharashtra</option>
        </>
      )}
      {watch("country") === "USA" && (
        <>
          <option value="California">California</option>
          <option value="Texas">Texas</option>
        </>
      )}
    </select>
    {errors.state && <p className="error">State is required</p>}

    {/* District */}
    <label>District *</label>
    <select {...register("district", { required: true })} disabled={!watch("state")}>
      <option value="">Map District to State</option>
      {watch("state") === "Karnataka" && (
        <>
          <option value="Bangalore">Bangalore</option>
          <option value="Mysore">Mysore</option>
        </>
      )}
      {watch("state") === "California" && (
        <>
          <option value="LA">Los Angeles</option>
          <option value="SF">San Francisco</option>
        </>
      )}
    </select>
    {errors.district && <p className="error">District is required</p>}

    {/* Block */}
    <label>Block (mandal) *</label>
    <select {...register("block", { required: true })} disabled={!watch("district")}>
      <option value="">Map Block (mandal) to District</option>
      {watch("district") === "Bangalore" && (
        <>
          <option value="Block 1">Block 1</option>
          <option value="Block 2">Block 2</option>
        </>
      )}
      {watch("district") === "LA" && (
        <>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
        </>
      )}
    </select>
    {errors.block && <p className="error">Block (mandal) is required</p>}

    {/* Village */}
    <label>Village *</label>
    <select {...register("village", { required: true })} disabled={!watch("block")}>
      <option value="">Map Village to Block (mandal)</option>
      {watch("block") === "Block 1" && (
        <>
          <option value="Village 1">Village 1</option>
          <option value="Village 2">Village 2</option>
        </>
      )}
      {watch("block") === "Block A" && (
        <>
          <option value="Village A1">Village A1</option>
          <option value="Village A2">Village A2</option>
        </>
      )}
    </select>
    {errors.village && <p className="error">Village is required</p>}

    {/* Zipcode */}
    <label>Zipcode *</label>
    <input
      type="text"
      {...register("zipcode", { required: true })}
      placeholder="Map Zipcode to Village"
      disabled={!watch("village")}
    />
    {errors.zipcode && <p className="error">Zipcode is required</p>}

    <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
  </div>
)}
           {selectedChild === "🌍 Global Area" && (
  <div className="adminform-section">
    <h2>Global Area</h2>
    <label>Age *</label>
    <input
      type="number"
      placeholder="Define age limit in between numbers"
      {...register("globalAge", { required: true })}
    />
    {errors.globalAge && <p className="error">Age is required</p>}

    <label>Education *</label>
    <input
      type="text"
      placeholder="Add Education"
      {...register("globalEducation", { required: true })}
    />
    {errors.globalEducation && <p className="error">Education is required</p>}

    <label>Type *</label>
    <input
      type="text"
      placeholder="Map Type to Education"
      {...register("globalType", { required: true })}
    />
    {errors.globalType && <p className="error">Type is required</p>}

    <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
  </div>
)}

{selectedChild === "🌱 Crop Settings" && (
  <div className="admin-config-section">
    <h2>Crop Settings</h2>

    <label>Crop Name (Feature) *</label>
    <input
      type="text"
      placeholder="Add Crop Feature (108 Crop upload)"
      {...register("cropName", { required: true })}
    />
    {errors.cropName && <p className="error-message">Crop Name is required</p>}

    <label>Crop Type (Variety) *</label>
    <input
      type="text"
      placeholder="Map Variety to Crop Feature"
      {...register("cropType", { required: true })}
    />
    {errors.cropType && <p className="error-message">Crop Type is required</p>}

    <div className="admin-btn">
      <button type="button" onClick={handlePrevious}>Previous</button>
      <button type="submit">Next</button>
    </div>
  </div>
)}

          </form>
        </FormProvider>
        {/* Right side image */}
        <div className="image-section">
            <img src={adminImage} alt="Admin" />
          </div>
      </div>
    </div>
  );
}