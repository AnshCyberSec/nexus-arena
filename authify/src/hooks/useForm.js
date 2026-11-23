import { useState } from 'react';

export const useForm = (initialValues = {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input change handle karo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Agar pehle koi error tha, toh naya input aate hi hata do
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Form submit handle karo
  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();

    // Validation run karo
    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Agar koi error hai, toh submit mat karo
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await callback(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form reset karo (submit ke baad)
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
  };
};