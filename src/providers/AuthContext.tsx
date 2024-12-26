import Loader from "@/components/common/Loader";
// import OrganizationController from '@controllers/OrganizationController';
// import StoreController from '@controllers/StoreController';
import { observer } from "mobx-react";
import React, { createContext, useState, useEffect, useContext } from "react";
import * as auth from "aws-amplify/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
      const checkUser = async () => {
        try {
          const currentUser = await auth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log("🚀 ~ checkUser ~ error:", error);
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        } finally {
          console.log("🚀 ~ checkUser ~ finally execute.");
          setIsLoading(false);
        }
      };
      checkUser();
    }, []);

    return (
      <AuthContext.Provider value={{ isAuthenticated, isLoading, user }}>
        {!isLoading ? children : <Loader />}
      </AuthContext.Provider>
    );
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
