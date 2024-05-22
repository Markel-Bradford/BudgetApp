import React from "react";

// helper functions
import { fetchData } from "../helpers";

// rrd imports
import { useLoaderData, Outlet } from "react-router-dom";

// UI imports
import Navbar from "../Components/Navbar";

// loader
export function mainLoader() {
  const userName = fetchData("userName");
  return { userName };
}

const Main = () => {
  const { userName } = useLoaderData();

  return (
    <div className="layout">
      <Navbar userName={userName}/>
      <main>
        <Outlet />
        </main>
    </div>
  );
};

export default Main;
