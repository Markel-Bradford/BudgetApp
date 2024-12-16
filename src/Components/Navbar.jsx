import React from "react";
import { Form, NavLink } from "react-router-dom";



const Navbar = ({userName}) => {
  
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo">
            myFinance
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </NavLink>
          <ul className="nav-menu">
            {/* <li>
            {userName && (
            <Form method="post" action="/info" onSubmit={{event}}>
              <button type="submit" className="btn btn--info">Budget Types</button>
          </Form>)}
          </li> */}
          <li>
           {userName && (
              <Form method="post" action="/logout" onSubmit={(event) => {
                if (!confirm("Log out?")) {
                    event.preventDefault() // Prevents page from deleting and refreshing
                }
              }}>
                <button type="submit" className="btn btn--warning">
                  <span>Log out</span>
                </button>
              </Form>
            )} 
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
