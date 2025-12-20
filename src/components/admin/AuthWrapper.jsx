import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/ed/admin/login" replace />;
  }
  return <Outlet />;
};

export const PublicRoute = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return <Navigate to="/ed/admin/home" replace />;
  }
  return <Outlet />;
};
