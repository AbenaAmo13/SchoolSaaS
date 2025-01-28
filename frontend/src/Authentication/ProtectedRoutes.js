import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Providers/AuthenticationProvider";

const PrivateRoute = () => {
  const {user, access_token, refresh_token} = useAuth();
  if (!access_token) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;