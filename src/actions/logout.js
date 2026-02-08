import { redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://budgetapp-37rv.onrender.com/api/";

/**
 * Log the user out by calling logout endpoint and clearing client-side data.
 * @returns {Promise} Redirects to the home page after logout.
 */
export async function logoutAction() {
    try {
        // Call backend logout endpoint to clear the HTTP-only cookie
        await axios.post(`${BASE_URL}users/logout`, {});

        // Clear user data from localStorage
        localStorage.removeItem("userId");

        // Display success toast notification
        toast.success("You've successfully logged out!");
        
        // Hard reload to reset auth state
        window.location.href = "/BudgetApp";
    } catch (error) {
        console.error("Logout error:", error);
        // Clear localStorage anyway if logout fails
        localStorage.removeItem("userId");
        toast.error("Logout completed. Please refresh if needed.");
        // Hard reload to reset auth state
        window.location.href = "/BudgetApp";
    }
}
