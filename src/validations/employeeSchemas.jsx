import * as Yup from "yup";

const employeeSchemas = [
  // Step 0: Employee Details
  Yup.object().shape({
    salutation: Yup.string().required("Salutation is required"),
    firstName: Yup.string().required("First name is required"),
    middleName: Yup.string().required("Middle name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.string().required("Date of Birth is required"),
    nationality: Yup.string().required("Nationality is required"),
    fatherName: Yup.string().required("Father name is required"),
    contactNumber: Yup.string()
      .required("Contact number is required")
      .matches(/^\d{10}$/, "Contact number must be 10 digits"),
    alternativeContactNumber: Yup.string()
      .nullable()
      .matches(/^\d{10}$/, "Alternative number must be 10 digits")
      .notRequired(),
    alternativeRelationType: Yup.string().required("Alternative type is required"),
  }),

  // Step 1: Contact Details
  Yup.object().shape({
    contactNumber: Yup.string()
      .required("Contact number is required")
      .matches(/^\d{10}$/, "Must be 10 digits"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
  }),

  // Step 2: Other Details
  Yup.object().shape({
    relation: Yup.string().required("Relation type is required"),
    fatherName: Yup.string().required("Father name is required"),
    altNumber: Yup.string()
      .nullable()
      .matches(/^\d{10}$/, "Must be 10 digits")
      .notRequired(),
    alternativeType: Yup.string().required("Alternative type is required"),
  }),

  // Step 3: Address
  Yup.object().shape({
    address: Yup.object().shape({
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      block: Yup.string().required("Block (mandal) is required"),
      village: Yup.string().required("Village is required"),
      zipcode: Yup.string()
        .required("Zipcode is required")
        .matches(/^\d{6}$/, "Zipcode must be 6 digits"),
    }),
  }),

  // employeeSchemas[4]
Yup.object().shape({
  professional: Yup.object().shape({
    education: Yup.string().required("Education is required"),
    experience: Yup.string()
      .required("Experience is required")
      .matches(/^\d+$/, "Experience must be a number in years"),
  }),
}),

  // Step 5: Bank Details
Yup.object().shape({
  bank: Yup.object().shape({
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string()
      .required("Account number is required")
      .matches(/^\d+$/, "Only digits allowed"),
    branchName: Yup.string().required("Branch name is required"),
    ifscCode: Yup.string()
      .required("IFSC code is required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    passbook: Yup.mixed().required("Passbook file is required"),
  }),
}),

  // Step 6: Documents
 Yup.object().shape({
  documentType: Yup.string().required("Document Type is required"),

  voterId: Yup.string().when("documentType", {
    is: "voterId",
    then: (schema) => schema.required("Voter ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  voterFile: Yup.mixed().when("documentType", {
    is: "voterId",
    then: (schema) => schema.required("Voter ID File is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  aadharNumber: Yup.string().when("documentType", {
    is: "aadharNumber",
    then: (schema) =>
      schema
        .required("Aadhar Number is required")
        .matches(/^\d{12}$/, "Must be 12 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),

  aadharFile: Yup.mixed().when("documentType", {
    is: "aadharNumber",
    then: (schema) => schema.required("Aadhar File is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  panNumber: Yup.string().when("documentType", {
    is: "panNumber",
    then: (schema) =>
      schema
        .required("PAN Number is required")
        .matches(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN format"),
    otherwise: (schema) => schema.notRequired(),
  }),

  panFile: Yup.mixed().when("documentType", {
    is: "panNumber",
    then: (schema) => schema.required("PAN File is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  ppbNumber: Yup.string().notRequired(),
  ppbFile: Yup.mixed().notRequired(),
}),


  // Step 7: Portal Access
  Yup.object().shape({
    portalAccess: Yup.object().shape({
      role: Yup.string().required("Role is required"),
      status: Yup.string().required("Access status is required"),
    }),
  }),
];

export default employeeSchemas;
