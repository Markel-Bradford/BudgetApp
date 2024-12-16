import React, { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { newUser } from "../helpers";

const Signin = () => {
  const [usernameInput, setUsernameInput] = useState("");

  const handleFormSubmit = () => {
    if (usernameInput.trim()) {
      newUser({userName: usernameInput.trim()});
      console.log("User created:", usernameInput);
    } else {
      console.log("Please enter a valid username.")
    }
  }

  return (
    <div className="container">
      <div className="welcomeFormContainer">
        <ul id="welcome">
          <li>W</li>
          <li>e</li>
          <li>l</li>
          <li>c</li>
          <li>o</li>
          <li>m</li>
          <li>e</li>
          <li>!</li>
        </ul>
        <Form className="signInForm" method="POST" onSubmit={handleFormSubmit}>
          <h2 id="welcomeMessage">Sign in and let's get started!</h2>
          <input
            type="text"
            name="userName"
            id="userName"
            required
            placeholder="What is your name?"
            autoComplete="given-name"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)} // Update state dunamically
          />
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="submitbutton">
            Create Account
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
      <div className="welcomeImgContainer">
        <img
          className="welcome-img"
          src="/BudgetApp/images/Budget.png"
          alt="Money"
          align="right"
        />
      </div>
    </div>
  );
};

export default Signin;
