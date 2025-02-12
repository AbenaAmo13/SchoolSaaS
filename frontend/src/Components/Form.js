import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { redirect } from "react-router";
import  '../Authentication/style/registration.css';

const Form = ({ endpoint, fields, onSuccess, onError, dataManipulation, includeCredentials, customHandleSubmit}) => {
 
  const [formData, setFormData] = useState(generateInitialState || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function generateInitialState() {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.type === 'checkbox' ? false : (field.type === 'select' ? field.options[0].value : '');
      return acc;
    }, {});
  }

  useEffect(()=>{
    setFormData(generateInitialState())

  },[fields])




  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const defaultHandleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Reset previous error

    try {
      const dataToSubmit = dataManipulation ? dataManipulation(formData) : formData;
      if(includeCredentials){
        axios.defaults.withCredentials = true; 
    }
      const response = await axios.post(endpoint, dataToSubmit);
      // If the request is successful, trigger the onSuccess callback
      onSuccess(response.data);
    } catch (err) {
      // If there is an error, set the error state and trigger the onError callback
      setError(err.response ? err.response.data.non_field_errors : err.message);
      onError(err); // Pass error to callback for handling
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (field) => {
    const { name, type, label, icon, required, options } = field;

    return type === 'select' ? (
      <select name={name} value={formData[name]} onChange={handleChange} required={required}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : type === 'checkbox' ? (
      <input type="checkbox" name={name}  onChange={handleChange} required={required} />
    ) : (
      <input type={type || 'text'} name={name} value={formData[name]} onChange={handleChange} required={required} placeholder={field.placeholder || ''} />
    );
  };


  const handleSubmit = customHandleSubmit
  ? (e) => customHandleSubmit(e, formData, setIsSubmitting, setError)
  : defaultHandleSubmit;  

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className='form-container'>
        {fields.map(field => (
          <div key={field.name} className={`form-group ${field.type=='checkbox' ? 'flex': ''}` }>
            <label htmlFor={field.name}>
            {field.icon && <i className={`fas fa-${field.icon}`}></i>}  {/* Render icon if provided */}
                {field.label}
            </label>
            {renderInput(field)}
          </div>
        ))}
        
        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

     
    </form>
  );
};

export default Form;
