import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";
import * as auth from "aws-amplify/auth";

const ProtectedRoute: React.FC = observer(() => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuthStatus();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await auth.getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Authentication check failed:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
});

export default ProtectedRoute;
