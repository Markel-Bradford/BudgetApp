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
        
        // Hard reload after redirect to ensure all client-side state resets
        setTimeout(() => {
            window.location.href = "/BudgetApp"; // Replace with your base path
        }, 200); // Delay to allow toast to display
        return redirect("/")
    } catch (error) {
        console.error("Error logging out:", error);
        toast.error("Logout failed. Please try again.");
        return redirect("/"); // Stay on the dashboard in case of error
    }
}
