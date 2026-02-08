import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({userName}) => {
  const { logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    if (confirm("Log out?")) {
      await logout();
    }
  };
  
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo">
            myFinance
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </NavLink>
          <ul className="nav-menu">
            <li>
             {userName && (
                <button 
                  onClick={handleLogout}
                  className="btn btn--warning"
                >
                  <span>Log out</span>
                </button>
              )} 
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
