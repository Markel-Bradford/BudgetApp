import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers";
//toast library
import { toast } from "react-toastify";


export async function logoutAction() {
    // delete the user

    deleteItem({
        type: "user" 
    });
    console.log("User logged out.")

    toast.success(
        "You've successfully logged out!"
    );

    //return redirect
    return redirect("/")
}