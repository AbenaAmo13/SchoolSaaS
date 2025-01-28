import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null)
  const navigate = useNavigate();



  function actionPostLoginOrSubmit(data, navigateUrl){
    setUser(data.user);
    setRefreshToken(data.refreshToken);
    setAccessToken(data.accessToken)
    navigate(navigateUrl);
  }

  async function postRequest(dataToSubmit, endpoint){
    let baseUrl = process.env.REACT_APP_DJANGO_API_URL
    let fullEndpoint = `${baseUrl}${endpoint}`
    console.log(endpoint)
    const response = await axios.post(fullEndpoint, dataToSubmit);
    let data = response.data
    return data
  }

  const authenticationAction = async (dataToSubmit, endpoint) => {
    //endpoint can be login, /api/login endpoint can be sign up /api/registration
    try {
        let data = postRequest( dataToSubmit,endpoint)
        if (data) {
            actionPostLoginOrSubmit(data, 'homepage')
        }
    } catch (err) {
      console.error(err);
    }
  };

 

  const logOut = () => {
    setUser(null);
    setAccessToken("");
    setRefreshToken("")
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, authenticationAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};