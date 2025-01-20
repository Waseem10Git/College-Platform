import {memo, useContext} from "react";
import "./ConfirmDelete.css";
import UserContext from "../../context/UserContext";

const ConfirmDelete = memo(({ deletionVisible, setDeletionVisible, handleDelete }) => {
    const { language } = useContext(UserContext);

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
                    <h2>{language === 'En' ? 'Confirming Deletion' : 'تأكيد الحذف'}</h2>
                </div>
                <div>
                    <button id={'ConfirmDelete_upload-button'} type="submit" style={{ marginRight: "5px"}}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                    <button id={'ConfirmDelete_cancel-button'} type="button" onClick={() => setDeletionVisible(false)}>{language === 'En' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </form>
        </div>
    );
});

export default ConfirmDelete;
