import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import createAxiosInstance from '../utils/axiosInstance'
import AxiosAPIError from './AxiosAPIError';  // adjust path if needed

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [authenticationError, setAuthenticationError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true); // initially loading
  const [school, setSchool] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const navigate = useNavigate();
  let baseUrl = import.meta.env.VITE_APP_AUTHENTICATION_DJANGO_API_URL
  const authAxios = createAxiosInstance(baseUrl); // Authentication base URL

  function actionPostLoginOrSubmit(data) {    
    setUser(data.user);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    if (data.school) {
      setSchool(data.school)
      sessionStorage.setItem('school',  JSON.stringify(data.school));
    }
    setAccessToken(data['access_token'])
    setRefreshToken(data['refresh_token'])
    setIsAuthenticated(true)
    navigate('/homepage');
    return { success: true};
  }


  async function postRequest(dataToSubmit, endpoint) {
    const fullEndpoint = `${baseUrl}${endpoint}`;
    const postResponse = await authAxios.post(fullEndpoint, dataToSubmit);
    let responseData = postResponse['data'] || postResponse['response']['data']
    console.log(postResponse)
    console.log(responseData)
    let errors = responseData['errors'] ? responseData['errors']   : []
    console.log('errors are:',errors)
    if(errors.length > 0){
      throw new AxiosAPIError('API Axios Error thrown', errors);
    }
    return {
      data: responseData,
      status: postResponse.status
    };
  }

  const authenticationAction = async (dataToSubmit, endpoint) => {
    //endpoint can be login, /api/login endpoint can be sign up /api/registration
    setAuthenticationError(null)
    try {
      let response = await postRequest(dataToSubmit, endpoint)
      console.log(response.status)
      if (response.status === 200 || response.status === 201) {
        actionPostLoginOrSubmit(response.data);
      }
    
    } catch (err) {
      console.log(err)
      setAuthenticationError(err.error_array)
    }
  };




  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      let user = sessionStorage.getItem("user")
      if(!accessToken){
        const response = await authAxios.post(`${baseUrl}/token/refresh/`)
        let responseData = response.data.data;
        let newAccessToken = responseData.access_token
        if (response.data.success) {
          user = responseData.user
          setAccessToken(newAccessToken);
          setRefreshToken(responseData.refresh_token)
          setUser(user)
          setIsAuthenticated(true)
        }
        authAxios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`; // Update the Axios default Authorization header
      }
      setUser(user)
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }finally{
        setIsAuthLoading(false); // done checking
    }
    
  };

  // Function to handle API requests that automatically refresh the token if expired
  const handleRequest = async (requestFunction) => {
    try {
      return await requestFunction();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Access token has expired, try to refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the original request with the new token
          return await requestFunction();
        }
      }
      throw err; // If the error is not due to token expiration, rethrow it
    }
  }

  const logout = () => {
    setUser(null);
    setAccessToken("");
    setRefreshToken("")
    document.cookie = "access_token=; Max-Age=0; path=/";
    document.cookie = "refresh_token=; Max-Age=0; path=/";
    setIsAuthenticated(false)
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, school, authenticationError, authenticationAction, logout, refreshAccessToken, handleRequest, isAuthenticated, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};