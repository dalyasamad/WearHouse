// Provides a reusable React hook for component state and behavior.


import { useState } from "react";

// Manages reusable useForm hook state and helper behavior.
function useForm(initialValues, validate = () => ({})) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setValues((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function setFieldValue(name, value) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validateForm() {
    const validationErrors =
      validate(values) || {};

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  }

  function resetForm() {
    setValues(initialValues);
    setErrors({});
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    setFieldValue,
    validateForm,
    resetForm,
  };
}

export default useForm;