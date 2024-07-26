import "./ConfirmDelete.css"
import React from "react";

const ConfirmDelete = ({deletionVisible, setDeletionVisible, handleDelete}) => {
    return (
        <div className={`modal ${deletionVisible ? "visible" : "hidden"}`}>
            <form>
                <div className="modal-header">
                    <h2>Confirming Deletion</h2>
                </div>
                <div>
                    <button onClick={() => handleDelete}>Delete</button>
                    <button type="button" onClick={() => setDeletionVisible(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ConfirmDelete;