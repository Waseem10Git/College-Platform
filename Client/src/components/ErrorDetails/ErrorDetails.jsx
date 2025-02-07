import React, {useContext, useState} from "react";
import "./ErrorDetails.css";
import UserContext from "../../context/UserContext";

const ErrorDetails = ({ summary, errors }) => {
    const { language } = useContext(UserContext);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <div className="error-details-container">
            {/* Brief summary */}
            <div className="error-summary" onClick={toggleExpanded}>
                <p>{language === 'En' ? summary.EnMessage : summary.ArMessage}</p>
                <button type={'button'} className="error-details-toggle-button" id={"error-details-toggle-button"}>
                    {isExpanded ? language === 'En' ? "Hide Details" : "إخفاء التفاصيل" : language === 'En' ? "View Details" : "إظهار التفاصيل"}
                </button>
            </div>

            {/* Detailed errors */}
            {isExpanded && (
                <div className="error-details">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>
                                <strong>{language === 'En' ? 'Row' : 'الصف'} {error.row}:</strong>
                                <ul>
                                    {(language === 'En' ? error.EnErrors : error.ArErrors).map((errMsg, i) => (
                                        <li key={i}>{errMsg}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ErrorDetails;
