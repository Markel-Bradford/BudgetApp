import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

//Error page
import Error from "./Pages/Error";

//Layout
import Main, { mainLoader } from "./layouts/Main";

//Actions
import { logoutAction } from "./actions/logout";

//Helpers
import { getCurrentUser } from "./helpers";

//Pages
import Dashboard from "./Pages/Dashboard";
import Signin from "./Components/Signin";

//Library imports
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Protected route component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session from token stored in HTTP-only cookie
    const restoreSession = async () => {
      const wasLoggedIn = localStorage.getItem("userId");
      if (!wasLoggedIn) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) {
    return <div className='loadingSpinner'><img src="/BudgetApp/images/spinner.svg" className="spinner" alt="Loading spinner" /></div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signin />,
      errorElement: <Error />
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Dashboard />
        </ProtectedRoute>
      ),
      errorElement: <Error />
    },
    {
      path: "/logout",
      action: logoutAction
    },
    {
      path: "*",
      element: <Error />    
    }
  ], {
    basename: "/BudgetApp"
  });
  
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
