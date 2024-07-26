import React from "react";
import uploadLabel from "../../Pages/FileUpload/images/uploadLabel.png";
import "./UploadFile.css"

const UploadFile = ({ handleFileChange, file, uploadingVisible, setUploadingVisible, handleSubmit }) => {
    return (
        <div className={`modal ${uploadingVisible ? "visible" : "hidden"}`}>
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h2>Upload File</h2>
                </div>
                <label htmlFor='fileInput'>
                    <img src={uploadLabel} className="upload-icon" alt='upload icon' /> {!!file ? "Change" : "Select"} File
                </label>
                <input id='fileInput' type="file" onChange={handleFileChange} />
                <div className={"confirm-cancel"}>
                    <button type='submit'>Upload</button>
                    <button type="button" onClick={() => setUploadingVisible(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default UploadFile;
