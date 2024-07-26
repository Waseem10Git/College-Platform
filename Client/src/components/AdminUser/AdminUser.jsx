import {Navigate} from "react-router-dom";


function AdminUser ({ children, Role }) {
    if (Role === "admin"){
        return(
            <>
                {children}
            </>
        )
    }else {
        return <Navigate to={"/"}/>
    }
}

export default AdminUser;