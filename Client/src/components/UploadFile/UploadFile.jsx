import uploadLabel from "./images/uploadLabel.png";
import "./UploadFile.css";
import {useContext} from "react";
import UserContext from "../../context/UserContext";

const UploadFile = ({ handleFileChange, file, uploadingVisible, setUploadingVisible, handleSubmit, errorMessage }) => {
    const { language } = useContext(UserContext);
    return (
        <div className={`modal ${uploadingVisible ? "visible" : "hidden"}`}>
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h2>{language === 'En' ? 'Upload Chapter' : 'رفع المحاضرة'}</h2>
                </div>
                <label htmlFor='fileInput' className={"UploadFile_Select-File"}>
                    <img src={uploadLabel} className="UploadFile_upload-icon" alt='upload icon'/>
                    <span>
                        {!!file ? (language === 'En' ? 'Change' : 'تغير') : (language === 'En' ? 'Select' : 'تحديد')} {language === 'En' ? 'Chapter' : 'محاضرة'}
                    </span>
                </label>
                <input id='fileInput' type="file" accept={"application/pdf"} onChange={handleFileChange}/>
                {errorMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{errorMessage}</p>
                )}
                <div className={"confirm-cancel"}>
                    <button id={'UploadFile_upload-button'} className={"UploadFile_button"} type='submit' style={{ marginRight: "5px"}}>{language === 'En' ? 'Upload' : 'رفع'}</button>
                    <button id={'UploadFile_cancel-button'} className={"UploadFile_button"} type="button" onClick={() => setUploadingVisible(false)}>{language === 'En' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </form>
        </div>
    );
}

export default UploadFile;
