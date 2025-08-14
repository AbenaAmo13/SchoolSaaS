import React, { useEffect } from 'react';
import { useNavigate } from "react-router";
import './style/registration.css';
import { loginFormFields, createSchoolFormFields } from './utils/constant';
import { useState } from 'react';
import Form from '../Components/Form';
import { useAuth } from '../Providers/AuthenticationProvider';
import createAxiosInstance from '../utils/axiosInstance'


const AuthLayout = ({ children }) => {
  const [loginFormState, setLginFormState] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate(); // Instantiate useNavigate
  let baseUrl = import.meta.env.VITE_APP_AUTHENTICATION_DJANGO_API_URL
  let endpoint = loginFormState ? '/login/' : '/school/'
  const { authenticationAction, authenticationError, user, isAuthenticated, setAuthenticationContextData } = useAuth();
  const [isLoadingModules, setIsLoadingModules] = useState(true);


  useEffect(() => {
    generateModuleOptions()

  }, [])

  useEffect(() => {
    console.log(user)
    if(user && isAuthenticated){
      console.log('Is Authenticated, time for a redirect!')
      navigate('/homepage')
    }
  }, [user])

   // Watch for authentication error changes
   useEffect(() => {
    if (authenticationError) {
      setError(authenticationError);
    }
  }, [authenticationError]);

  function toggleFormState() {
    setLginFormState(prev => !prev);
  }

  async function generateModuleOptions() {
    try {
      const getModules = createAxiosInstance(baseUrl);
      let fullEndpoint = `${baseUrl}/register/`;
      const response = await getModules.get(fullEndpoint);
      const data = response.data;

      let modifiedModuleOptions = data.map(module => ({
        value: module.id,
        label: module.name
      }));

      let moduleIndex = createSchoolFormFields.findIndex(field => field.name === "module");
      if (moduleIndex !== -1) {
        createSchoolFormFields[moduleIndex].options = modifiedModuleOptions;
      }
    } catch (err) {
      console.error("Error fetching module options", err);
      setError("Failed to load module options.");
    } finally {
      setIsLoadingModules(false);
    }
  }



  // Chanhges the data to be in the form of the api
  const createSchoolDataManipulation = (formData) => {
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



  async function customHandleSubmit(e, formData, setIsSubmitting, setError) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let dataToSubmit = loginFormState ? formData : createSchoolDataManipulation(formData)
    let response = await authenticationAction(dataToSubmit, endpoint)
    if(response.status === 200 || response.status === 201){    
    setAuthenticationContextData(response.data)
    }
    setIsSubmitting(false);

  }

  return (
    <div className='auth-layout'>
      <div className='container'>
        <div className="bg-image"></div>
        <div className='content'>
          <div className='btn-containers align-center min-gap'>
            <i className={`${loginFormState ? 'fas fa-school' : 'fas fa-sign-in-alt'} `}></i>
            <button className='create-btn' onClick={toggleFormState}>
              {loginFormState ? 'Create School' : 'Login'}
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
          {isLoadingModules ? (
            <p className="loading-text">Loading module options...</p>
          ) : (
            <Form
              fields={loginFormState ? loginFormFields : createSchoolFormFields}
              customHandleSubmit={customHandleSubmit}
              error={error}
              setError={setError}
            />
          )}
        </div>
        <main>
          {children} {/* This is where the specific pages like Login or Register will be rendered */}
        </main>

      </div>
    </div>
  );
};

export default AuthLayout;
