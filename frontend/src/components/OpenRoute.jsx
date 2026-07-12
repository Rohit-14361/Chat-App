import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default OpenRoute;
