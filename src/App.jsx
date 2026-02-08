import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";

//Error page
import Error from "./Pages/Error";

//Layout
import Main, { mainLoader } from "./layouts/Main";

//Actions
import { logoutAction } from "./actions/logout";

//Helpers
import { getCurrentUser } from "./helpers";

//Library imports
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Pages/Dashboard";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        errorElement: <Error />
      },
    {
      path: "/logout",
      action: logoutAction
    }
    ]
  },
  {
    path: "*",
    element: <Error />    
  }
],
{
  basename: "/BudgetApp", // Set basename to match gh repository
})

function App() {
  useEffect(() => {
    // Restore user session from token stored in HTTP-only cookie
    const restoreSession = async () => {
      // Only attempt to restore if user was previously logged in
      const wasLoggedIn = localStorage.getItem("userId");
      if (!wasLoggedIn) return;

      try {
        await getCurrentUser();
        // User data is fetched and validated via cookie
      } catch (error) {
        // Token is invalid or expired, user needs to log in again
        localStorage.removeItem("userId");
      }
    };

    restoreSession();
  }, []);
  
  return (
  <div className="App">
    <RouterProvider router = {router} />
    <ToastContainer />
  </div>
  )
}

export default App;
