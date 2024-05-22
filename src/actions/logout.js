import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers";
//toast library
import { toast } from "react-toastify";


export async function logoutAction() {
    // delete the user

    deleteItem({
        key: "userName"
    });

    toast.success(
        "You've successfully deleted your account!"
    );

    //return redirect
    return redirect("/")
}