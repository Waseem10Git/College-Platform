import {Navigate} from "react-router-dom";


function InstructorUser ({ children, Role }) {
    if (Role === "instructor"){
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