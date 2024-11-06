import React, {useContext, useState} from 'react';
import './FileUpload.css';
import uploadImage from "./images/upload.svg"
import uploadLabel from "./images/uploadLabel.png"
import UserContext from "../../context/UserContext";

const FileUpload = () => {
  const {isDarkMode} = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Please upload a file first.");
    }
  };

  return (
    <div className={`file-upload-container ${isDarkMode && "dark"}`}>
      <div className='content'>
      <img src={uploadImage} alt='File Upload'/>
      <label onClick={() => setIsVisible(true)}> <img src={uploadLabel} alt='upload icon'/> {!!file ? "Change" : "Upload"} File</label>
      <button disabled={!file} onClick={handleDownload}>Download</button>
      <Modal isVisible={isVisible} handleFileChange={handleFileChange} file={file} setIsVisible={setIsVisible}  />
      </div>
    </div>
  );
};

const Modal = ({handleFileChange, file, isVisible, setIsVisible}) => {
  return (
    <div className={`modal ${isVisible ? "visible" : "hidden"}`}>
    <form >
      <h2>Upload file</h2>
      <label htmlFor='fileInput'> <img src={uploadLabel} alt='upload icon'/> {!!file ? "Change" : "Upload"} File</label>
      <input id='fileInput' type="file" onChange={handleFileChange} />
      <select>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Mathematics">Mathematics</option>
      </select>
      <button onClick={() => setIsVisible(false)} type='button'>Upload</button>
    </form>
    </div>
  );
}

export default FileUpload;
