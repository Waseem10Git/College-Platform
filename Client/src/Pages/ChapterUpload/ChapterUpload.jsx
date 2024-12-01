import {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { UploadFile, ConfirmDelete } from "../../components";
import uploadLabel from "../FileUpload/images/uploadLabel.png";
import "./ChapterUpload.css"
import UserContext from "../../context/UserContext";
import chaptersApi from "../../api/chaptersApi";
import {toast} from "react-toastify"
import notificationApi from "../../api/notificationApi";
import { SlCloudDownload } from "react-icons/sl";
import { SlTrash } from "react-icons/sl";
import { SlBookOpen } from "react-icons/sl";

const ChapterUpload = () => {
    const { isDarkMode, language, role } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [fileView, setFileView] = useState(null);
    const [uploadingVisible, setUploadingVisible] = useState(false);
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState('');
    const { courseCode, userId } = useParams();

    const fetchData = async () => {
        try {
            const response = await chaptersApi.fetchChapters(courseCode);
            setChapters(response.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseCode, userId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            e.target.value = null;  // Reset the file input
            return;
        }
        setFile(selectedFile);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file){
            setFileErrorMessage('Select File First Please');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        try {
            const uploadResponse = await chaptersApi.addChapter(courseCode, formData);
            console.log(uploadResponse)

            if (uploadResponse.status === 200){
                toast.success(language === 'En' ? 'Chapter uploaded successfully!' : 'تم رفع المحاضرة بنجاح!');
                setFile(null);
                setUploadingVisible(false);
                setFileErrorMessage('');

                const notificationMessage = language === 'En' ? 'New Chapter uploaded for course' : 'تم رفع محاضرة جديدة!';
                await notificationApi.sendNotification(userId, courseCode, notificationMessage);
            }

            fetchData();

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Error uploading chapter' : 'خطأ في رفع المحاضرة');
            }
        }
    };

    const handleDownload = async (chapterId, fileName) => {
        try {
            const response = await chaptersApi.downloadChapter(chapterId);
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
            await chaptersApi.deleteChapter(chapterId);
            toast.error(language === 'En' ? 'Chapter deleted successfully' : 'تم حذف المحاضرة بنجاح!')
            fetchData();
        } catch (error) {
            console.error('Error deleting chapter', error);
        }
    };

    const handleView = async (chapterId) => {
        try {
            const response = await chaptersApi.viewChapter(chapterId);
            const contentType = response.headers["content-type"];
            const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
            console.log(url, contentType)
            setFileView({ url, contentType });
        } catch (error) {
            console.error("Error viewing chapter", error);
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
                    <div className={"Chapters_file-upload-container"}>
                        <div className={"Chapters_content"}>
                            <label className={"Chapters_Select-Chapter"} onClick={() => setUploadingVisible(true)}>
                                <img src={uploadLabel} className="Chapters_upload-icon" alt='upload icon'/>
                                <span>
                                    {!!file ? (language === 'En' ? 'Change' : 'تغير') : (language === 'En' ? 'Select' : 'تحديد')} {language === 'En' ? 'File' : 'ملف'}
                                </span>
                            </label>
                            <UploadFile
                                uploadingVisible={uploadingVisible}
                                handleFileChange={handleFileChange}
                                file={file}
                                setUploadingVisible={setUploadingVisible}
                                handleSubmit={handleSubmit}
                                errorMessage={fileErrorMessage}
                            />
                        </div>
                    </div>
                </>
            ) : null }
            {
                errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>
            }
            <div className={`Chapters_courses-container ${isDarkMode && "Chapters_dark"}`}>
                <div className="Chapters_courses">
                    {chapters.map(chapter => (
                        <div key={chapter.id} className="Chapters_courses-card">
                            {chapter.chapter_name}
                            <button onClick={() => handleDownload(chapter.id, chapter.chapter_name)}>
                                {language === 'En' ? 'Download:' : 'تنزيل:'}
                                <SlCloudDownload/>
                            </button>
                            <button onClick={() => handleView(chapter.id)}>
                                {language === 'En' ? 'View:' : 'عرض:'}
                                <SlBookOpen/>
                            </button>
                            {role === 'instructor' && (
                                <>
                                    <button onClick={() => setDeletionVisible(true)}>
                                        {language === 'En' ? 'Delete:' : 'حذف:'}
                                        <SlTrash/>
                                    </button>
                                    <ConfirmDelete deletionVisible={deletionVisible}
                                                   setDeletionVisible={setDeletionVisible}
                                                   handleDelete={() => handleDelete(chapter.id)}/>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div>
                    {fileView && <div className={`Chapters_overlay-background ${isDarkMode ? 'dark' : ''}`} onClick={() => setFileView(null)}></div>}
                    {fileView && (
                        <div className={`Chapters_overlay ${isDarkMode ? 'dark' : ''}`} >
                            <div className="Chapters_overlay-content" >
                                <h3>{language === 'En' ? 'File preview' : 'عرض الملف'}</h3>
                                <embed src={fileView.url} type="application/pdf" width="100%" height="600px"/>
                                <button onClick={() => setFileView(null)}>
                                    {language === 'En' ? 'Close Preview' : 'إغلاق الملف'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChapterUpload;
