import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Error page
import Error from "./Pages/Error";

//Layout
import Main, { mainLoader } from "./layouts/Main";
import Dashboard, { dashboardAction, dashboardLoader } from "./Pages/Dashboard";

//Actions
import { logoutAction } from "./actions/logout";

//Library imports
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />
      },
    {
      path: "logout",
      action: logoutAction
    }
    ]
  },
  {
    path: "*",
    element: <Error />    
  }
])

function App() {
  return (
  <div className="App">
    <RouterProvider router = {router} />
    <ToastContainer />
  </div>
  )
}

export default App;
