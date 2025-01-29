import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Providers/AuthenticationProvider";

const PrivateRoute = () => {
  const {user, accessToken, refreshToken, refreshAccessToken} = useAuth();


   // Trigger token refresh if expired
   useEffect(() => {
    // Check for token expiration and refresh if needed
    refreshTokenIfExpired();
  }, [accessToken, refreshToken, refreshAccessToken]);

  const refreshTokenIfExpired = async () => {
    if (!accessToken && refreshToken) {
      console.log(`Access token has expired `)
      try {
        // Attempt to refresh the token
        await refreshAccessToken();
      } catch (error) {
        // If refreshing fails, log out the user or show an error
        console.error("Failed to refresh token", error);
      }
    }
  };


  if (!accessToken) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;