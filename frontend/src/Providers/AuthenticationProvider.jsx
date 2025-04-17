import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import createAxiosInstance from '../utils/axiosInstance'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [authenticationError, setAuthenticationError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [school, setSchool] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const navigate = useNavigate();
  let baseUrl = import.meta.env.REACT_APP_AUTHENTICATION_DJANGO_API_URL
  const authAxios = createAxiosInstance(baseUrl); // Authentication base URL

  

function actionPostLoginOrSubmit(data){
    setUser(data.user);
    if(data.school){
        setSchool(data.school)
    }
    setAccessToken(data['access_token'])
    setRefreshToken(data['refresh_token'])
    setIsAuthenticated(true)
    navigate('/homepage');
  }

  async function postRequest(dataToSubmit, endpoint){
    let fullEndpoint = `${baseUrl}${endpoint}`
    const response = await authAxios.post(fullEndpoint, dataToSubmit);
    let data = response.data
    return data
  }

  const authenticationAction = async (dataToSubmit, endpoint) => {
    //endpoint can be login, /api/login endpoint can be sign up /api/registration
    setAuthenticationError(null)
    try {
        let data = await  postRequest( dataToSubmit,endpoint)
        if (data) {
            actionPostLoginOrSubmit(data)
        }
    } catch (err) {
      let errors = err.response ? err.response.data.non_field_errors : err.message
      let message = errors.join();
      setAuthenticationError(message)
      throw err;  // Rethrow error to handle it in the parent (if necessary)
    }
  };
 

  

    // Function to refresh the access token
    const refreshAccessToken = async () => {
        try {
          const response = await authAxios.post(`${baseUrl}/api/token/refresh/`)
          const newAccessToken = response.data.access;
          setAccessToken(newAccessToken);
          authAxios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`; // Update the Axios default Authorization header
          return newAccessToken;
        } catch (err) {
          console.error("Token refresh failed:", err);
          logout();
          return null;
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
    <AuthContext.Provider value={{ accessToken, refreshToken, user, school , authenticationError, authenticationAction,logout, refreshAccessToken, handleRequest, isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};