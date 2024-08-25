import {Navigate} from "react-router-dom";

function StudentInstructorUser ({ children, Role }) {
    if (Role === "student" || Role === "instructor"){
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