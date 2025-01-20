import React, { useState } from "react";
import "./ErrorDetails.css"; // Optional for custom styling

const ErrorDetails = ({ summary, errors }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <div className="error-details-container">
            {/* Brief summary */}
            <div className="error-summary" onClick={toggleExpanded}>
                <p>{summary}</p>
                <button type={'button'} className="error-details-toggle-button" id={"error-details-toggle-button"}>
                    {isExpanded ? "Hide Details" : "View Details"}
                </button>
            </div>

            {/* Detailed errors */}
            {isExpanded && (
                <div className="error-details">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>
                                <strong>Row {error.row}:</strong>
                                <ul>
                                    {error.errors.map((errMsg, i) => (
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
