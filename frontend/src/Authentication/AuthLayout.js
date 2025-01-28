import React, { useEffect } from 'react';
import { data, useNavigate } from "react-router-dom";
import  './style/registration.css';
import { loginFormFields, createSchoolFormFields} from './utils/constant';
import { useState } from 'react';
import Form from '../Components/Form';
import axios from "axios";
import { useAuth } from '../Providers/AuthenticationProvider';

const AuthLayout = ({ children }) => {
    const [loginFormState, setLginFormState] = useState(true) 
    const navigate = useNavigate(); // Instantiate useNavigate
    let baseUrl = process.env.REACT_APP_DJANGO_API_URL
    let endpoint = loginFormState ?'/api/login/' : '/api/school/'
    let fullEndpoint = `${baseUrl}${endpoint}`
    const auth = useAuth();



    useEffect(()=>{
        generateModuleOptions()

    },[])

    const handleSuccess = (data) => {
        console.log('Form submitted successfully:', data);
        navigate('/homepage'); // This will redirect to '/dashboard' after successful login
        // Handle success (e.g., navigate, show success message)
      };
    const handleError = (error) => {
        console.error('Form submission error:', error);
        // Handle error (e.g., show an error message)
      };


    function toggleFormState(){
        setLginFormState(prev =>!prev);
    }

    async function generateModuleOptions(){
        const response = await axios.get(`${baseUrl}/api/register/`);
        const data = response.data
        let modifiedModuleOptions = data.map(module => {
            return { 
             value: module.id, 
             label: module.name
            };
          });
        let moduleIndex = createSchoolFormFields.findIndex(field=> field.name=="module")
        if(moduleIndex!==1){
            createSchoolFormFields[moduleIndex].options = modifiedModuleOptions
        }
    }


    // Chanhges the data to be in the form of the api
  const createSchoolDataManipulation = (formData) => {
    console.log(formData.cambridge_certified)
    return {
      school: {
        name: formData.name,
        email: formData.email,
        contact_number: formData.contact_number,
        school_acronym: formData.school_acronym,
        cambridge_certified: formData.cambridge_certified,
        modules: [formData.module] //To replace with chosen selelct options as only one for now
      },
      user: {
        username: formData.username,
        password: formData.password,
        role: 'admin',  // Example: hardcoded role
        email: formData.email,
        is_staff: true //
      }
    };
  };

  const noManipulation=(formData)=>{
    return formData
  }

  async function customHandleSubmit(e, formData, setIsSubmitting, setError){
    e.preventDefault();
    setIsSubmitting(true);
    //setError(null); // Reset previous error
    try {
     console.log(formData)
      let dataToSubmit =  loginFormState ? noManipulation : createSchoolDataManipulation(formData)
      console.log(fullEndpoint)
      console.log(dataToSubmit)
      auth.authenticationAction(dataToSubmit, fullEndpoint)
      handleSuccess(auth.user)
    } catch (err) {
      setError(err.response ? err.response.data.non_field_errors : err.message);
      handleError(err)
    } finally {
      setIsSubmitting(false);
    }
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
                fields={loginFormState ? loginFormFields: createSchoolFormFields} 
                customHandleSubmit={customHandleSubmit}
            />
        </div>
        <main>
        {children} {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

    </div>

  );
};

export default AuthLayout;
