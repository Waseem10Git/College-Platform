import React, {useState, useEffect, useContext} from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';
import { UploadFile, ConfirmDelete } from "../../components";
import uploadLabel from "../FileUpload/images/uploadLabel.png";
import styles from "./ChapterUpload.module.css"
import UserContext from "../../context/UserContext";

const ChapterUpload = () => {
    const { isDarkMode, language, role } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [fileView, setFileView] = useState(null);
    const [uploadingVisible, setUploadingVisible] = useState(false);
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { courseCode, userId } = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/courses/${courseCode}/chapters`);
            setChapters(response.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseCode, userId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        try {
            await axios.post(`/api/courses/${courseCode}/chapters`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Chapter uploaded successfully');
            setFile(null);

            const notificationMessage = `New Chapter uploaded for course `;
            await axios.post(`/api/send-notification`, {
                userId: userId,
                courseCode: courseCode,
                message: notificationMessage
            });

            fetchData();

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                console.error('Error uploading chapter', error);
            }
        }
    };

    const handleDownload = async (chapterId, fileName) => {
        try {
            const response = await axios.get(`/api/chapters/${chapterId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading chapter', error);
        }
    };

    const handleDelete = async (chapterId) => {
        try {
            await axios.delete(`/api/chapters/${chapterId}`);
            alert('Chapter deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Error deleting chapter', error);
        }
    };

    const handleView = async (chapterId) => {
        try {
            const response = await axios.get(`/api/chapters/${chapterId}/view`, {
                responseType: 'blob',
            });
            const contentType = response.headers['content-type'];
            const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
            setFileView({ url, contentType });
        } catch (error) {
            console.error('Error viewing chapter', error);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (role === "instructor") {
            setIsDragging(true);
        }
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        if (role === "instructor") {
            setIsDragging(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (role === "instructor") {
            setIsDragging(false);
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                setFile(files);
            }
        }
    };

    return (
        <div className={`course-view ${isDarkMode ? 'dark-mode' : 'light-mode'} ${language.toLowerCase()}`}
             onDragOver={handleDragOver}
             onDragEnter={handleDragEnter}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
        >
            {role === 'instructor' ? (
                <>
                    <div className={"file-upload-container"}>
                        <div className={"content"}>
                            <label onClick={() => setUploadingVisible(true)}>
                                <img src={uploadLabel} className={"upload-icon"} alt='upload icon'/>
                                {!!file ? "Change" : "Upload"} File
                            </label>
                            <UploadFile
                                uploadingVisible={uploadingVisible}
                                handleFileChange={handleFileChange}
                                file={file}
                                setUploadingVisible={setUploadingVisible} handleSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </>
            ) : null }
            {
                errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>
            }
            <div className={"courses-container"}>
                <h3>Uploaded Chapters</h3>
                <div className={"courses"}>
                    {chapters.map(chapter => (
                        <div key={chapter.id} className="courses-card">
                            {chapter.chapter_name}
                            <button onClick={() => handleDownload(chapter.id, chapter.chapter_name)}>Download</button>
                            <button onClick={() => handleView(chapter.id)}>View</button>
                            {role === 'instructor' && (
                                <>
                                    <button onClick={() => setDeletionVisible(true)}>Delete</button>
                                    <ConfirmDelete deletionVisible={deletionVisible} setDeletionVisible={setDeletionVisible} handleDelete={() => handleDelete(chapter.id)} />
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {fileView && (
                    <div>
                        <h3>File Preview</h3>
                        {fileView.contentType.startsWith('image/') && (
                            <img src={fileView.url} alt="File Preview" style={{width: '100%', height: 'auto'}}/>
                        )}
                        {fileView.contentType === 'application/pdf' && (
                            <embed src={fileView.url} type="application/pdf" width="100%" height="600px"/>
                        )}
                        <button onClick={() => setFileView(null)}>Close Preview</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterUpload;
