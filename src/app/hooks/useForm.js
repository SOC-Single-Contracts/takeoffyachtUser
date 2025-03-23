import { useState } from 'react';
export const useForm = (initialState = {}) => {
 const [values, setValues] = useState(initialState);
 const [errors, setErrors] = useState({});
 const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
   setValues({
     ...values,
     [e.target.id]: e.target.value
   });
 };
  const resetForm = () => {
   setValues(initialState);
   setErrors({});
 };
  return {
   values,
   errors,
   isLoading,
   setIsLoading,
   handleChange,
   setErrors,
   resetForm,
   setValues
 };
};