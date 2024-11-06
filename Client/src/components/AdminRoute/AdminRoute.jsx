import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../context/UserContext";


function AdminRoute () {
    const { role } = useContext(UserContext);

}

export default AdminRoute;