import "./ConfirmDelete.css"
import React from "react";

const ConfirmDelete = ({ deletionVisible, setDeletionVisible, handleDelete }) => {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleDelete();
        setDeletionVisible(false);
    };

    return (
        <div className={`modal ${deletionVisible ? "visible" : "hidden"}`}>
            <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                    <h2>Confirming Deletion</h2>
                </div>
                <div>
                    <button type="submit">Delete</button>
                    <button onClick={() => setDeletionVisible(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ConfirmDelete;
