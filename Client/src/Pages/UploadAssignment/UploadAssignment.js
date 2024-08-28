import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './UploadAssignment.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const UploadAssignment = ({ isDarkMode, language, userId }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch courses
        axios.get(`/api/instructor/${userId}/courses`)
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error fetching courses:', error));
    }, [userId]);

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleFileChange = (e) => {
        setAssignmentFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('selectedCourse', selectedCourse);
        formData.append('assignmentName', assignmentName);
        formData.append('assignmentDescription', assignmentDescription);
        formData.append('assignmentFile', assignmentFile);
        formData.append('userId', userId);

        const adjustedDueDate = dueDate ? moment(dueDate).format() : '';
        formData.append('dueDate', adjustedDueDate);

        axios.post('/api/upload-assignment', formData)
            .then(response => {
                console.log('Assignment uploaded successfully:', response.data);
                alert(language === 'En' ? 'Assignment uploaded successfully!' : 'تم رفع الواجب بنجاح!');
                // Clear form after submission
                setSelectedCourse('');
                setAssignmentName('');
                setAssignmentDescription('');
                setAssignmentFile(null);
                setDueDate(null);
            })
            .catch(error => {
                console.error('Error uploading assignment:', error);
                alert(language === 'En' ? 'Failed to upload assignment!' : 'فشل في رفع الواجب!');
            });

        const notificationMessage = `New Assignment Uploaded for course `;
        axios.post(`/api/send-notification`, {
            userId: userId,
            courseCode: selectedCourse,
            message: notificationMessage
        }).then(response => {
            console.log('send notification {New Assignment Uploaded} for students');
        }).catch(error => {
            console.log('Error sending notification to students');
        });
    };

    return (
        <div className={`upload-assignment ${isDarkMode ? 'dark' : 'light'} ${language === 'Ar' ? 'rtl' : ''}`}>
            <h2>{language === 'En' ? 'Upload new Assignment' : 'رفع واجب جديد'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseSelect">
                        {language === 'En' ? 'Select Course:' : 'اختر الدورة الدراسية:'}
                    </label>
                    <select
                        id="courseSelect"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        required
                    >
                        <option value="" disabled>
                            {language === 'En' ? 'Select course' : 'اختر الدورة الدراسية'}
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
                        <div className="form-group">
                            <label htmlFor="assignmentName">
                                {language === 'En' ? 'Assignment Name:' : 'اسم الواجب:'}
                            </label>
                            <input
                                type="text"
                                id="assignmentName"
                                value={assignmentName}
                                onChange={(e) => setAssignmentName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="assignmentDescription">
                                {language === 'En' ? 'Assignment Description:' : 'وصف الواجب:'}
                            </label>
                            <textarea
                                id="assignmentDescription"
                                value={assignmentDescription}
                                onChange={(e) => setAssignmentDescription(e.target.value)}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="assignmentFile">
                                {language === 'En' ? 'Upload File:' : 'رفع ملف:'}
                            </label>
                            <input
                                type="file"
                                id="assignmentFile"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">
                                {language === 'En' ? 'Due Date:' : 'تاريخ الاستحقاق:'}
                            </label>
                            <DatePicker
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="input-field"
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
