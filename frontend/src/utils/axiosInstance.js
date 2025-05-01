import axios from 'axios';

// Factory function to create a new Axios instance
const createAxiosInstance = (baseURL, accessToken = null) => {
  const axiosInstance = axios.create({
    baseURL,            // Custom baseURL
    withCredentials: true, // Ensure cookies are sent along with requests
    headers:{
     "Content-Type" :  "application/json",
    }
   
  });

  // Response Interceptor to handle 401 errors (token expiration)
  axiosInstance.interceptors.response.use(
    async config=>{
      axiosInstance.defaults.withCredentials = true
      if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    response => response, // Pass through successful responses
    async error => {
      const originalRequest = error.config;

      // Check if the error is due to an expired token (401 Unauthorized)
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the access token using the refresh token

          const refreshResponse = await axiosInstance.post('/token/refresh/'); // Ensure your backend supports this
          let refreshResponseData = refreshResponse.data.data
          const newAccessToken = refreshResponseData.access_token;

          // Attach the new access token to the original request and retry it
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retry the original request with the new token
          return axiosInstance(originalRequest); // Use axiosInstance instead of axios
        } catch (err) {
          console.error('Token refresh failed:', err);
          // Redirect user to login page if refresh fails
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }
      return Promise.reject(error); // Return the error if not 401 or no retry
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
