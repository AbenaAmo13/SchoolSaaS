import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../Providers/AuthenticationProvider";

const PrivateRoute = () => {
  const {isAuthenticated, refreshAccessToken, accessToken} = useAuth();

  const refreshTokenIfExpired = async () => {
    if (!accessToken || !isAuthenticated) {
      try {
       await refreshAccessToken();  // Attempt to refresh the token
      } catch (error) {
        console.error("Failed to refresh token", error); // If refreshing fails, log out the user or show an error
      }
    }
  };

   // Trigger token refresh if expired
   useEffect(() => {
    console.log(`The access token is ${accessToken} and isAuthenticated is ${isAuthenticated} `)
    // Check for token expiration and refresh if needed
    refreshTokenIfExpired();
  }, [accessToken, isAuthenticated]);




  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;