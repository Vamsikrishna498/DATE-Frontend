// src/validations/stepSchemas.js
import * as Yup from "yup";

const stepSchemas = [
  Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  }),
  // Add other steps here...
];

export default stepSchemas;
