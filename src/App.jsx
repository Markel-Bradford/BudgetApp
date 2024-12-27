import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Error page
import Error from "./Pages/Error";

//Layout
import Main, { mainLoader } from "./layouts/Main";

//Actions
import { logoutAction } from "./actions/logout";

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
        index: true,
        element: <Dashboard />,
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
],
{
  basename: "/BudgetApp", // Set basename to match gh repository
})

function App() {
  return (
  <div className="App">
    <RouterProvider router = {router} />
    <ToastContainer />
  </div>
  )
}

export default App;
