// Renders a reusable React interface component.


import {
  Navigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

// Renders the reusable ProtectedRoute interface component.
function ProtectedRoute({ children }) {
  const { isAuthenticated } =
    useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;