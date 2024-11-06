import {Navigate} from "react-router-dom";
import {useContext} from "react";
import UserContext from "../../context/UserContext";


function InstructorUser ({ children }) {
    const { role } = useContext(UserContext);
    if (role === "instructor"){
        return(
            <>
                {children}
            </>
        )
    }else {
        return <Navigate to={"/"}/>
    }
}

export default InstructorUser;