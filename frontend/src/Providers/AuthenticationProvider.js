import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [authenticationError, setAuthenticationError] = useState(null)
  const [school, setSchool] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const navigate = useNavigate();
  let baseUrl = process.env.REACT_APP_DJANGO_API_URL


  useEffect(() => {
    if (accessToken && refreshToken) {
      // If access and refresh tokens are present, set Axios authorization header
      axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

function actionPostLoginOrSubmit(data, navigateUrl){
    setUser(data.user);
    if(data.school){
        setSchool(data.school)
    }
    setRefreshToken(data['refresh_token']);
    setAccessToken(data['access_token'])
    navigate('/homepage');
  }

  async function postRequest(dataToSubmit, endpoint){
    let fullEndpoint = `${baseUrl}${endpoint}`
    console.log(dataToSubmit)
      console.log(fullEndpoint)
    const response = await axios.post(fullEndpoint, dataToSubmit);
    let data = response.data
    return data
  }

  const authenticationAction = async (dataToSubmit, endpoint) => {
    //endpoint can be login, /api/login endpoint can be sign up /api/registration
    setAuthenticationError(null)
    try {
        
        let data = await  postRequest( dataToSubmit,endpoint)
        if (data) {
            actionPostLoginOrSubmit(data, '/homepage')
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
          const response = await axios.post(`${baseUrl}/api/token/refresh/`, {
            refresh: refreshToken
          });
          const newAccessToken = response.data.access;
          setAccessToken(newAccessToken);
          // Update the Axios default Authorization header
          axios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
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
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, school , authenticationError, authenticationAction,logout, refreshAccessToken, handleRequest }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};