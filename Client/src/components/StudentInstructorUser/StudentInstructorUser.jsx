import {Navigate} from "react-router-dom";
import UserContext from "../../context/UserContext";
import {useContext} from "react";

function StudentInstructorUser ({ children }) {
    const { role } = useContext(UserContext);
    if (role === "student" || role === "instructor"){
        return(
            <>
                {children}
            </>
        )
    }else {
        return <Navigate to={"/"}/>
    }
}

export default StudentInstructorUser;