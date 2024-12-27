import React, { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { newUser } from "../helpers";

const Signin = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const handleCreateAccount = () => {
    if (usernameInput.trim(), emailInput.trim()) {
      newUser({name: usernameInput.trim(), email: emailInput.trim()});
      console.log("User created:", usernameInput, emailInput);
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
        <Form className="signInForm" method="POST" onSubmit={handleCreateAccount}>
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
          <input 
          type="email"
          name="email"
          id="email"
          required
          placeholder="john.doe@gmail.com"
          autoComplete="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)} />
          <input type="hidden" name="_action" value="newUser" />
          <div className="btncontainer">
          <button type="submit" className="submitbutton" >
            Create Account
            <UserPlusIcon width={20} />
          </button>
          <button type="submit" className="submitbutton signin">
            Sign In
            <ArrowRightEndOnRectangleIcon width={20} />
          </button>
          </div>
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
