import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../Providers/AuthenticationProvider";

const PrivateRoute = () => {
  const {isAuthenticated, refreshAccessToken, accessToken, isAuthLoading} = useAuth();

  useEffect(()=>{
    refreshAccessToken()
  },[])


  if(isAuthLoading) return <h1>Loading...</h1>


  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;