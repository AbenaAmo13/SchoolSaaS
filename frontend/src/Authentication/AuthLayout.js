import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import  './style/registration.css';
import { loginFormFields, createSchoolFormFields} from './utils/constant';
import { useState } from 'react';
import Form from '../Components/Form';
const AuthLayout = ({ children }) => {
    const [loginFormState, setLginFormState] = useState(true) 
    const handleSuccess = (data) => {
        console.log('Form submitted successfully:', data);
        // Handle success (e.g., navigate, show success message)
      };
    const handleError = (error) => {
        console.error('Form submission error:', error);
        // Handle error (e.g., show an error message)
      };


    function toggleFormState(){
        setLginFormState(prev =>!prev);
    }



  return (
    <div className='container'>
        <div className="bg-image"></div>
        <div className='content'>
            <div className='btn-containers align-center min-gap'>
                <i className={`${loginFormState? 'fas fa-school' : 'fas fa-sign-in-alt'} `}></i>
                <button className='create-btn' onClick={toggleFormState}>
                    {loginFormState ? 'Create Schol' : 'Login'}
                </button>

            </div>
            <div>
                <h1>Manage It</h1>
                <p className='descriptive-text'> 
                Welcome to Manage It, an all-in-one platform designed to streamline your school's administrative tasks. 
                From efficient online reporting and record management to seamless billing and communication, our system simplifies everyday operations, allowing you to focus on what truly matters—education.
                Log in or register to get started today!
                </p>
            </div>
            <Form 
                endpoint="https://example.com/api/register" 
                fields={loginFormState ? loginFormFields: createSchoolFormFields} 
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
