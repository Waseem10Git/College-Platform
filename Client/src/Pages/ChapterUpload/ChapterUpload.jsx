import {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { UploadFile, ConfirmDelete } from "../../components";
import uploadLabel from "../../components/UploadFile/images/uploadLabel.png";
import "./ChapterUpload.css"
import UserContext from "../../context/UserContext";
import chaptersApi from "../../api/chaptersApi";
import {toast} from "react-toastify"
import notificationApi from "../../api/notificationApi";
import { SlCloudDownload } from "react-icons/sl";
import { SlTrash } from "react-icons/sl";
import { SlBookOpen } from "react-icons/sl";
import assignmentsApi from "../../api/assignmentsApi";
import { FaFileAlt } from "react-icons/fa";
import { SiGoogletasks } from "react-icons/si";

const ChapterUpload = () => {
    const { isDarkMode, language, role } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [fileView, setFileView] = useState(null);
    const [assignmentView, setAssignmentView] = useState(null);
    const [uploadingVisible, setUploadingVisible] = useState(false);
    const [chapterDeletionVisible, setChapterDeletionVisible] = useState(false);
    const [assignmentDeletionVisible, setAssignmentDeletionVisible] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState('');
    const [currentDeleteId, setCurrentDeleteId] = useState(null);
    const { courseCode, userId } = useParams();

    const fetchData = async () => {
        try {
            const response = await chaptersApi.fetchChapters(courseCode);
            setChapters(response.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await assignmentsApi.fetchAssignmentsForCourse(courseCode);
            setAssignments(response.data)
        } catch (err) {
            console.log('Error fetching assignments: ', err);
        }
    }

    useEffect(() => {
        fetchData();
        fetchAssignments();
    }, [courseCode, userId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            e.target.value = null;
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

                const EnNotificationMessage = `New Chapter uploaded for course `;
                const ArNotificationMessage = `تم رفع محاضرة جديدة للمادة `;
                await notificationApi.sendNotification(userId, courseCode, EnNotificationMessage, ArNotificationMessage);
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

    const handleDownload = async (id, fileName, type) => {
        try {
            let response;
            if (type === 'chapter')
                response = await chaptersApi.downloadChapter(id);
            else
                response = await assignmentsApi.downloadAssignment(id)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            // document.body.removeChild(link);
            // window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Error downloading');
        }
    };

    const handleDelete = async (chapterId) => {
        try {
            await chaptersApi.deleteChapter(chapterId);
            toast.success(language === 'En' ? 'Chapter deleted successfully' : 'تم حذف المحاضرة بنجاح!');
            fetchData();
            setCurrentDeleteId(null);
        } catch (error) {
            toast.error(language === 'En' ? "Error in deleting" : "خطأ في الحذف");
        }
    };

    const handleAssignmentDelete = async (assignmentId) => {
        try {
            await assignmentsApi.deleteAssignment(assignmentId);
            toast.success(language === 'En' ? 'Assignment deleted successfully' : 'تم حذف التكليف بنجاح!');
            fetchAssignments();
            setCurrentDeleteId(null);
        } catch (error) {
            toast.error(language === 'En' ? "Error in deleting" : "خطأ في الحذف");
        }
    }

    const handleView = async (id) => {
        try {
            if (!id) {
                toast.error(language === 'En' ? "No file to view" : "ليس هناك ملف لعرضه");
                return;
            }
            // Generate the view URL for the file
            const url = chaptersApi.viewChapter(id);
            window.open(url, "_blank");
            // setFileView({fileUrl: url});
        } catch (error) {
            toast.error(language === 'En' ? "Something went wrong while viewing chapter" : "حدثت مشكلة أثناء عرض الملف");
        }
    };

    const handleAssignmentView = async (id, assignmentDescription, assignmentDueDate, assignmentMimeType, assignmentFilePath) => {
        try {
            if (!id) {
                toast.error(language === 'En' ? "No file to view" : "ليس هناك ملف لعرضه");
                return;
            }
            // Generate the view URL for the file
            let url;
            if (assignmentFilePath)
                url = assignmentsApi.viewInstructorAssignment(id);
            setAssignmentView({
                fileUrl: url,
                description: assignmentDescription || null,
                due_date: assignmentDueDate,
                fileMimeType: assignmentMimeType,
            });
        } catch (error) {
            toast.error(language === 'En' ? "Something went wrong while viewing assignment" : "حدثت مشكلة أثناء عرض التكليف");
        }
    }

    const handleAssignmentViewUrl = (url) => {
        window.open(url, "_blank")
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours());
        return date.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <>
            <div className={`Chapters_course-view ${isDarkMode ? 'Chapters_dark-mode' : 'light-mode'} ${language.toLowerCase()}`}>
                {role === 'instructor' ? (
                    <>
                        <div className={"Chapters_file-upload-container"}>
                            <div className={"Chapters_content"}>
                                <label className={"Chapters_Select-Chapter"} onClick={() => setUploadingVisible(true)}>
                                    <img src={uploadLabel} className="Chapters_upload-icon" alt='upload icon'/>
                                    <span>
                                    {!!file ? (language === 'En' ? 'Change' : 'تغير') : (language === 'En' ? 'Select' : 'تحديد')} {language === 'En' ? 'Chapter' : 'محاضرة'}
                                </span>
                                </label>
                            </div>
                        </div>
                    </>
                ) : null}
                {
                    errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>
                }
                <div className={`Chapters_courses-container ${isDarkMode && "Chapters_dark"}`}>
                    <div className="Chapters_courses">
                        {chapters.map(chapter => (
                            <div key={chapter.id} className="Chapters_courses-card">
                                <div className="Assignments_card-header">
                                    <span>{chapter.chapter_name}</span>
                                    <div className="Assignments_icon-container">
                                        <FaFileAlt className="Assignments_icon"/>
                                        <span
                                            className="Assignments_tooltip">{language === 'En' ? 'Chapter' : 'محاضرة'}</span>
                                    </div>
                                </div>
                                <button id={'Chapters_download-button'} onClick={() => handleDownload(chapter.id, chapter.chapter_name, 'chapter')}>
                                    {language === 'En' ? 'Download:' : 'تنزيل:'}
                                    <SlCloudDownload/>
                                </button>
                                <button onClick={() => handleView(chapter.id, 'chapter')}>
                                    {language === 'En' ? 'View:' : 'عرض:'}
                                    <SlBookOpen/>
                                </button>
                                {role === 'instructor' && (
                                    <>
                                        <button id={'Chapters_delete-button'} onClick={() => {
                                            setChapterDeletionVisible(true)
                                            setCurrentDeleteId(chapter.id);
                                        }}>
                                            {language === 'En' ? 'Delete:' : 'حذف:'}
                                            <SlTrash/>
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {assignments.length > 0 && chapters.length > 0 ? (
                        <>
                            <br/>
                            <hr/>
                            <br/>
                        </>
                    ) : null}

                    <div className="Chapters_courses">
                        {assignments.map(assignment => (
                            <div key={assignment.assignment_id} className="Chapters_courses-card">
                                <div className="Assignments_card-header">
                                    <span>{assignment.assignment_title}({assignment.assignment_score})</span>
                                    <div className="Assignments_icon-container">
                                        <SiGoogletasks className="Assignments_icon"/>
                                        <span
                                            className="Assignments_tooltip">{language === 'En' ? 'Assignment' : 'تكليف'}</span>
                                    </div>
                                </div>
                                <button
                                    id={'Chapters_download-button'}
                                    onClick={() => handleDownload(assignment.assignment_id, assignment.assignment_file_name, 'assignment')}
                                    disabled={!assignment.assignment_file_name}>
                                    {language === 'En' ? 'Download:' : 'تنزيل:'}
                                    <SlCloudDownload/>
                                </button>
                                <button
                                    onClick={() => handleAssignmentView(assignment.assignment_id, assignment.description, assignment.due_date, assignment.assignment_mime_type, assignment.assignment_file_path)}>
                                    {language === 'En' ? 'View:' : 'عرض:'}
                                    <SlBookOpen/>
                                </button>
                                {role === 'instructor' && (
                                    <>
                                        <button id={'Chapters_delete-button'} onClick={() => {
                                            setAssignmentDeletionVisible(true)
                                            setCurrentDeleteId(assignment.assignment_id)
                                        }}>
                                            {language === 'En' ? 'Delete:' : 'حذف:'}
                                            <SlTrash/>
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        {fileView && <div className={`Chapters_overlay-background ${isDarkMode ? 'dark' : ''}`}
                                          onClick={() => setFileView(null)}></div>}
                        {fileView && (
                            <div className={`Chapters_overlay ${isDarkMode ? 'dark' : ''}`}>
                                <div className="Chapters_overlay-content">
                                    <h3>{language === 'En' ? 'File preview' : 'عرض الملف'}</h3>
                                    <embed src={fileView.fileUrl} type="application/pdf" width="100%" height="600px"/>
                                    <button onClick={() => setFileView(null)}>
                                        {language === 'En' ? 'Close Preview' : 'إغلاق الملف'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {assignmentView && <div className={`Chapters_overlay-background ${isDarkMode ? 'dark' : ''}`}
                                                onClick={() => setAssignmentView(null)}></div>}
                        {assignmentView && (
                            <div className={`Chapters_overlay ${isDarkMode ? 'dark' : ''}`}>
                                <div className="Chapters_overlay-content">
                                    <h3>{language === 'En' ? 'Assignment Preview' : 'عرض التكليف'}</h3>

                                    {assignmentView.due_date && (
                                        <p><strong>{language === 'En' ? 'Deadline: ' : 'الموعد النهائي: '}</strong> {formatDate(assignmentView.due_date)}</p>
                                    )}

                                    {/* Display the description if it exists */}
                                    {assignmentView.description && (
                                        <p><strong>{language === 'En' ? 'Description: ' : 'الوصف: '}</strong> {assignmentView.description}</p>
                                    )}

                                    {/* If neither exists, show a fallback message */}
                                    {!assignmentView.fileUrl && !assignmentView.description && (
                                        <p>{language === 'En' ? 'No content available for this assignment.' : 'لا يوجد محتوى لهذا الواجب.'}</p>
                                    )}

                                    <div className={'Chapters_viewButtons'}>
                                        <button onClick={() => setAssignmentView(null)}>
                                            {language === 'En' ? 'Close Preview' : 'إغلاق العرض'}
                                        </button>

                                        {/* Display the file if it exists */}
                                        {assignmentView.fileUrl && (
                                            // <embed src={assignmentView.fileUrl} type={assignmentView.fileMimeType} width="100%"
                                            //        height="600px"/>
                                            <button id={'Chapters_download-button'} onClick={() => handleAssignmentViewUrl(assignmentView.fileUrl)}>
                                                {language === 'En' ? 'View File' : 'عرض الملف'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {uploadingVisible && (
                <UploadFile
                    uploadingVisible={uploadingVisible}
                    handleFileChange={handleFileChange}
                    file={file}
                    setUploadingVisible={setUploadingVisible}
                    handleSubmit={handleSubmit}
                    errorMessage={fileErrorMessage}
                />
            )}
            {chapterDeletionVisible && (
                <ConfirmDelete deletionVisible={chapterDeletionVisible}
                               setDeletionVisible={setChapterDeletionVisible}
                               handleDelete={() => handleDelete(currentDeleteId)}/>
            )}
            {assignmentDeletionVisible && (
                <ConfirmDelete deletionVisible={assignmentDeletionVisible}
                               setDeletionVisible={setAssignmentDeletionVisible}
                               handleDelete={() =>
                                   handleAssignmentDelete(currentDeleteId)}/>
            )}
        </>
    );
};

export default ChapterUpload;
