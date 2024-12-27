import React, { useEffect, useRef, useState } from "react";
import { Form, useFetcher } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { newUser } from "../helpers";
import axios from "axios";

const Signin = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";
  
    const formRef = useRef();
    const focusRef = useRef();
  
  
    // If form is not submitting, the form will be reset.
    useEffect(() => {
      if(!isSubmitting) {
        //clear form
        formRef.current.reset()
      }
    }, //reset focus 
    [isSubmitting]);

  const handleCreateAccount = async () => {
    if (usernameInput.trim(), emailInput.trim()) {
      newUser({name: usernameInput.trim(), email: emailInput.trim()});
      console.log("User created:", usernameInput, emailInput);
    } else {
      console.log("Please enter a valid username.")
    }
  }

  const handleSignin = async () => {

    if (!usernameInput.trim() || !emailInput.trim()) {
      toast.error("Name and email required.")
      console.log("Please enter a name and email.")
      return
    }

    try {
      // Check if user exists
      const response = await axios.get("https://budgetapp-37rv.onrender.com/api/users/login", {
        params: {name: usernameInput.trim(), email: emailInput.trim() },
      });

      console.log("User logged in:", response.data)
      localStorage.setItem("userId", response.data._id)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("User not found. Please create an account.");
      } else {
        console.log("An error occurred. Please try again.");
      }
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
        <Form className="signInForm" method="POST" onSubmit={handleSignin} ref={formRef}>
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
            ref={focusRef}
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
          <button type="submit" className="submitbutton" onClick={handleCreateAccount}>
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
