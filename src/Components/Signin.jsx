import React, { useState } from "react";
import { Form } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";

const Signin = () => {
  const [usernameInput, setUsernameInput] = useState("");

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
        <Form className="signInForm" method="POST">
          <h2 id="welcomeMessage">Sign in and let's get started!</h2>
          <input
            type="text"
            name="userName"
            id="userName"
            required
            placeholder="What is your name?"
            autoComplete="given-name"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
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
          src="/images/Budget.png"
          alt="Money"
          align="right"
        />
      </div>
    </div>
  );
};

export default Signin;
