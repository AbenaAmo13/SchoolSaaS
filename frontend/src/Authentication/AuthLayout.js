import React from 'react';
import { Link } from 'react-router-dom';
import  './style/registration.css';
import { loginFormFields } from './utils/constant';
import Form from '../Components/Form';
const AuthLayout = ({ children }) => {
    const handleSuccess = (data) => {
        console.log('Form submitted successfully:', data);
        // Handle success (e.g., navigate, show success message)
      };
    
      const handleError = (error) => {
        console.error('Form submission error:', error);
        // Handle error (e.g., show an error message)
      };
    

  return (
    <div className='container'>
        <div className="bg-image"></div>
        <div className='content'>
            <Form 
                endpoint="https://example.com/api/register" 
                fields={loginFormFields} 
                onSuccess={handleSuccess} 
                onError={handleError}
            />

            
        </div>
        
        
        <main>
        {children} {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

    </div>

  );
};

export default AuthLayout;
