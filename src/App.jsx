import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect } from "react";

//Error page
import Error from "./Pages/Error";

//Actions
import { logoutAction } from "./actions/logout";

//Pages
import Dashboard from "./Pages/Dashboard";
import Signin from "./Components/Signin";

//Context
import { AuthProvider, useAuth } from "./context/AuthContext";

//Library imports
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const { isAuthenticated, loading, loggingOut } = useAuth();

  // Show spinner while logging out
  if (loggingOut) {
    return <div className='loadingSpinner'><img src="/BudgetApp/images/spinner.svg" className="spinner" alt="Logging out..." /></div>;
  }

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
        <ProtectedRoute>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
