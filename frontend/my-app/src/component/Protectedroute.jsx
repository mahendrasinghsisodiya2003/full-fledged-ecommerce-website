import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Protectedroute = ({ user }) => {
  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the requested component
  return <Outlet />;
};

export default Protectedroute;