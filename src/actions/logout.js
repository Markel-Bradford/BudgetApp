import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers"; // Ensure deleteItem handles clearing from storage
import { toast } from "react-toastify";

/**
 * Log the user out by deleting session data and redirecting.
 * @returns {Promise} Redirects to the home page after logout.
 */
export async function logoutAction() {
    try {
        // Delete the user session data (e.g., userId or auth token)
        deleteItem({
            type: "user", 
        });

        // Display success toast notification
        toast.success("You've successfully logged out!");

        // Redirect to home or login page after logging out
        return redirect("/");
    } catch (error) {
        console.error("Error logging out:", error);
        toast.error("Logout failed. Please try again.");
        return redirect("/dashboard"); // Stay on the dashboard in case of error
    }
}
