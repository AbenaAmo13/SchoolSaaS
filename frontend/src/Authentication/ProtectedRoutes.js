import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Providers/AuthenticationProvider";

const PrivateRoute = () => {
  const {isAuthenticated, refreshAccessToken, accessToken} = useAuth();

   // Trigger token refresh if expired
   useEffect(() => {
    // Check for token expiration and refresh if needed
    console.log(`The access token ${accessToken}`)
    console.log(`The authentication ${isAuthenticated}`)
    refreshTokenIfExpired();
  }, [isAuthenticated]);

  const refreshTokenIfExpired = async () => {
    if (!accessToken) {
      try {
        await refreshAccessToken();  // Attempt to refresh the token
      } catch (error) {
        console.error("Failed to refresh token", error); // If refreshing fails, log out the user or show an error
      }
    }
  };


  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;