import React, { useState } from 'react';
import axios from 'axios';

import  '../Authentication/style/registration.css';

const Form = ({ endpoint, fields, onSuccess, onError }) => {
  const [formData, setFormData] = useState(() => {
    // Initialise form data based on fields prop, defaulting to empty strings
    const initialState = {};
    fields.forEach(field => {
      initialState[field.name] = field.type === 'select' ? field.options[0].value : '';
    });
    return initialState;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Reset previous error

    try {
      const response = await axios.post(endpoint, formData);
      // If the request is successful, trigger the onSuccess callback
      onSuccess(response.data);
    } catch (err) {
      // If there is an error, set the error state and trigger the onError callback
      setError(err.response ? err.response.data.message : err.message);
      onError(err); // Pass error to callback for handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className='form-container'>
        {fields.map(field => (
          <div key={field.name} className={`form-group ${field.type==='checkbox' ? 'flex': ''}` }>
            <label htmlFor={field.name}>
            {field.icon && <i className={`fas fa-${field.icon}`}></i>}  {/* Render icon if provided */}
                {field.label}
            </label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
              >
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder || ''}
              />
            )}
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
