import React, { useEffect, useRef, useState } from "react";
import { Form, useFetcher, useNavigate } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { loginUser, newUser } from "../helpers";
import axios from "axios";
import { toast } from "react-toastify";

const Signin = () => {
  const [usernameInput, setUsernameInput] = useState("Guest");
  const [emailInput, setEmailInput] = useState("guest.player1086@gmail.com");
  const navigate = useNavigate();

  // Auto-populate and clear the input when clicked
  const handleFocus = (e) => {
    if (e.target.value === e.target.defaultValue) {
      e.target.value = "";
    }
  };
  
  useEffect(() => {
    const handleLoad = () => {
      toast.info(
        "Please feel free to sign in using the guest credentials to explore the app and test functionality: Name - Guest | Email - guest.player1086@gmail.com  You can also enter your own credentials to create a personal account!",
        { autoClose: 8000 } // Optional: Prevent toast from auto-closing
      );
    };

    const timeout = setTimeout(handleLoad, 1500);
    

    return () => {
      clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [])

  const handleFormSubmit = async (e) => {
    const action = e.nativeEvent.submitter.getAttribute("data-action");

    if (!usernameInput.trim() || !emailInput.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (action === "create") {
      // Handle create account
      try {
        if (usernameInput.trim(), emailInput.trim()) {
          newUser({name: usernameInput.trim(), email: emailInput.trim()});
          
            navigate("/"); // Redirect to baseroute

          

          console.log("User created:", usernameInput, emailInput);
        } else {
          console.error("Error signing in:", error);
          toast.error("Sign-in failed. Please try again.");
        }
      } catch (error) {
        console.error("Error creating account:", error);
        toast.error("Failed to create account. Please try again.");
      }
    } else if (action === "signin") {
      if (!usernameInput.trim() || !emailInput.trim()) {
        toast.error("Name and email required.")
        console.log("Please enter a name and email.")
        return
      }
  
      // Handle sign in
      try {
        // Check if user exists
        if (usernameInput.trim(), emailInput.trim()) {
          await loginUser({name: usernameInput.trim(), email: emailInput.trim()});
          
            navigate("/"); // Redirect to baseroute
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error("User not found. Please create an account.");
        } else {
          console.error("Error signing in:", error);
          toast.error("Sign-in failed. Please try again.");
        }
      }
    }
  };

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
            value={ usernameInput }
            onFocus={handleFocus} // Clear the input on focus if it's still the default value
            onChange={(e) => setUsernameInput(e.target.value)} // Update state dunamically
          />
          <input 
          type="email"
          name="email"
          id="email"
          required
          placeholder="john.doe@gmail.com"
          autoComplete="email"
          value={ emailInput }
          onFocus={handleFocus} // Clear the input on focus if it's still the default value
          onChange={(e) => setEmailInput(e.target.value)} />
          <input type="hidden" name="_action" value="newUser" />
          <div className="btncontainer">
          <button type="submit" className="submitbutton" data-action="create">
            Create Account
            <UserPlusIcon width={20} />
          </button>
          <button type="submit" className="submitbutton signin" data-action="signin">
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
