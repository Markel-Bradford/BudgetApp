import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../helpers";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const restoreSession = async () => {
      const wasLoggedIn = localStorage.getItem("userId");
      if (!wasLoggedIn) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      // Call backend logout endpoint to clear the HTTP-only cookie
      await axios.post("https://budgetapp-37rv.onrender.com/api/users/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user data from localStorage and state
      localStorage.removeItem("userId");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("You've successfully logged out!");
      // Hard reload to reset auth state
      window.location.href = "/BudgetApp";
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, loggingOut, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
