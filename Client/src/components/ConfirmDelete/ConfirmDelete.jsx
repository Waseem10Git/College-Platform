import React, { memo } from "react";
import "./ConfirmDelete.css";

const ConfirmDelete = memo(({ deletionVisible, setDeletionVisible, handleDelete }) => {
    if (!deletionVisible) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleDelete();
        setDeletionVisible(false);
    };

    return (
        <div className="ConfirmDelete_modal">
            <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                    <h2>Confirming Deletion</h2>
                </div>
                <div>
                    <button type="submit" style={{ marginRight: "5px"}}>Delete</button>
                    <button type="button" onClick={() => setDeletionVisible(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
});

export default ConfirmDelete;
