import React, {useState, useEffect, useContext} from 'react';
import './UploadAssignment.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import UserContext from "../../context/UserContext";
import coursesApi from "../../api/coursesApi";
import assignmentsApi from "../../api/assignmentsApi";
import notificationApi from "../../api/notificationApi";
import { toast } from 'react-toastify';

const UploadAssignment = () => {
    const { isDarkMode, language, userId, role } = useContext(UserContext);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentScore, setAssignmentScore] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [dueDate, setDueDate] = useState(new Date());
    const [courses, setCourses] = useState([]);
    const [assignmentContentErrMessage, setAssignmentContentErrMessage] = useState('');
    const [error, setError] = useState(false);
    
    const fetchCourses = async () => {
        try {
            const response = await coursesApi.fetchSomeCourses(role, userId);

            if (Array.isArray(response.data)) {
                setCourses(response.data);
            }
        } catch (error) {
            toast.error(language === 'En' ? 'Error fetching courses data' : 'فشل في جلب بيانات المواد');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [userId]);

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleFileChange = (e) => {
        setAssignmentFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAssignmentContentErrMessage('');

        if (!assignmentDescription.trim() && !assignmentFile){
            setAssignmentContentErrMessage(language === "En" ? "Please write a description of the assignment, select file , or both." : "الرجاء كتابة وصف للتكيف، أو تحديد ملف، أو كليهما.");
            return
        }

        const formData = new FormData();
        formData.append('selectedCourse', selectedCourse);
        formData.append('assignmentName', assignmentName);
        formData.append('assignmentScore', assignmentScore);
        formData.append('assignmentDescription', assignmentDescription);
        formData.append('assignmentFile', assignmentFile);
        formData.append('userId', userId);

        const adjustedDueDate = dueDate ? moment(dueDate).format() : '';
        formData.append('dueDate', adjustedDueDate);

        await assignmentsApi.uploadAssignmentByInstructor(formData)
            .then(response => {
                console.log('Assignment uploaded successfully:', response.data);
                toast.success(language === 'En' ? 'Assignment uploaded successfully' : 'تم رفع التكليف بنجاح');
                // Clear form after submission
                setSelectedCourse('');
                setAssignmentName('');
                setAssignmentScore('');
                setAssignmentDescription('');
                setAssignmentFile(null);
                setDueDate(new Date());
                setAssignmentContentErrMessage('');
                setError(false);
            })
            .catch(error => {
                if (error.response && error.response.data && !error.response.data.success){
                    toast.error(language === 'En' ?  error.response.data.EnMessage : error.response.data.ArMessage);
                    setError(true)
                } else {
                    toast.error(language === 'En' ? 'Failed to upload assignment' : 'فشل في رفع التكليف');
                    setError(true)
                }
            });

        if (!error) {
            const EnNotificationMessage = `New Assignment Uploaded for course `;
            const ArNotificationMessage = `تم رفع تكليف جديد للمادة `;
            await notificationApi.sendNotification(userId, selectedCourse, EnNotificationMessage, ArNotificationMessage);
        }
    };

    return (
        <div className={`UploadAssignment_component ${isDarkMode ? 'dark' : 'light'} ${language === 'Ar' ? 'rtl' : ''}`}>
            <h2>{language === 'En' ? 'Upload New Assignment' : 'رفع تكليف جديد'}</h2>
            <form onSubmit={handleSubmit} className="UploadAssignment_form">
                <h3>
                    {language === 'En' ? 'Select Course:' : 'اختر المادة الدراسية:'}
                </h3>
                <div className="UploadAssignment_form-group">
                    <select
                        id="courseSelect"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        required
                    >
                        <option value="" disabled>
                            {language === 'En' ? '-- Select Course --' : '-- اختر المادة --'}
                        </option>
                        {courses.map(course => (
                            <option key={course.course_code} value={course.course_code}>
                                {course.course_name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCourse && (
                    <>
                        <div className="UploadAssignment_form-group">
                            <label htmlFor="assignmentName">
                                {language === 'En' ? 'Assignment Name:' : 'اسم التكليف:'}
                            </label>
                            <input
                                type="text"
                                id="assignmentName"
                                value={assignmentName}
                                onChange={(e) => setAssignmentName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="UploadAssignment_form-group">
                            <label htmlFor="assignmentName">
                                {language === 'En' ? 'Assignment Score:' : 'درجة التكليف:'}
                            </label>
                            <input
                                type="number"
                                id="assignmentScore"
                                value={assignmentScore}
                                onChange={(e) => setAssignmentScore(e.target.value ? parseInt(e.target.value) : '')}
                                required
                                min={1}
                            />
                        </div>
                        <div className="UploadAssignment_form-group">
                            <label htmlFor="assignmentDescription">
                                {language === 'En' ? 'Assignment Description:' : 'وصف التكليف:'}
                            </label>
                            <textarea
                                id="assignmentDescription"
                                value={assignmentDescription}
                                onChange={(e) => setAssignmentDescription(e.target.value)}
                                rows="4"
                                placeholder={language === "En" ? "Type a description, upload any type of file, or both." : "اكتب وصفًا، أو قم بتحميل أي نوع من الملفات، أو كليهما."}
                            ></textarea>
                        </div>
                        <div className="UploadAssignment_form-group">
                            <label htmlFor="assignmentFile">
                                {language === 'En' ? 'Upload File:' : 'رفع ملف:'}
                            </label>
                            <input
                                type="file"
                                id="assignmentFile"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="UploadAssignment_form-group">
                            <label htmlFor="dueDate">
                                {language === 'En' ? 'Due Date:' : 'التاريخ النهائي لتسليم التكليف:'}
                            </label>
                            <DatePicker
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                id="UploadAssignment_input-field"
                                minDate={new Date()}
                                minTime={
                                    dueDate && dueDate.toDateString() === new Date().toDateString()
                                        ? new Date()  // If today, set minTime to now
                                        : new Date(new Date().setHours(0, 0, 0, 0))  // If another day, set minTime to start of day
                                }
                                maxTime={new Date(new Date().setHours(23, 59, 59, 999))} // Max time is the end of the day
                                required
                            />

                        </div>
                        {assignmentContentErrMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{assignmentContentErrMessage}</p>
                        )}
                        <button type="submit">
                            {language === 'En' ? 'Upload' : 'رفع'}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default UploadAssignment;
