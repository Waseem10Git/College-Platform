import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import './Assignments.css';
import axios from '../../api/axios';
import UserContext from "../../context/UserContext";
import chaptersApi from "../../api/chaptersApi";
import {SlBookOpen, SlCloudDownload} from "react-icons/sl";
import assignmentsApi from "../../api/assignmentsApi";
import AssignmentsApi from "../../api/assignmentsApi";

const Assignments = () => {
  const { isDarkMode, language, role, userId } = useContext(UserContext);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [fileView, setFileView] = useState(null);
  const [fileErrMessage, setFileErrMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/student/${userId}/courses`)
        .then(response => setCourses(response.data))
        .catch(error => console.error('Error fetching courses:', error));
  }, [role, userId]);

  console.log("courses: ", courses);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch assignments for the selected course from backend
      axios.get(`/api/assignments/${selectedCourse}`)
          .then(response => setAssignments(response.data))
          .catch(error => console.error('Error fetching assignments:', error));
    }
  }, [selectedCourse]);

  console.log("assignments: ", assignments);

  const handleCourseChange = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    setSelectedAssignment(null);
  };

  const handleAssignmentChange = (e) => {
    const assignmentId = parseInt(e.target.value, 10);
    const assignment = assignments.find((a) => a.assignment_id === assignmentId);
    setSelectedAssignment(assignment);
  };
  console.log("Selected assignment", selectedAssignment)

  const handleFileChange = (e) => {
    setStudentFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFileErrMessage('');
    if (!studentFile) {
      setFileErrMessage(language === 'En' ? 'Please select a file first' : 'رجاءا اختيار ملف لرفعه');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', studentFile);
    formData.append('courseId', selectedCourse);
    formData.append('assignmentId', selectedAssignment.assignment_id);
    formData.append('instructorCourseId', selectedAssignment.instructors_courses_id);

    axios.post('/api/upload-student-assignment', formData)
        .then(response => {
          console.log('Student Assignment Uploaded:', response.data);
          alert(language === 'En' ? 'Assignment uploaded successfully!' : 'تم رفع الواجب بنجاح!');
          // Clear form after submission
          setSelectedCourse('');
          setSelectedAssignment(null);
          setStudentFile(null);
        })
        .catch(error => {
          console.error('Error uploading assignment:', error);
          alert(language === 'En' ? 'Failed to upload assignment!' : 'فشل في رفع الواجب!');
        });
  };

  const handleView = async (assignmentId) => {
    setFileErrMessage('');
    try {
      const response = await assignmentsApi.viewInstructorAssignment(assignmentId);
      const contentType = response.headers["content-type"];
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      console.log(url, contentType)
      setFileView({ url, contentType });
    } catch (error) {
      console.error("Error viewing chapter", error);
    }
  };

  const handleDownload = async (assignmentId, assignmentName) => {
    try {
      const response = await AssignmentsApi.downloadAssignment(assignmentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', assignmentName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading chapter', error);
    }
  };

  return (
      <div className={`UploadAssignment_component ${isDarkMode ? 'dark' : 'light'} ${language === 'Ar' ? 'rtl' : ''}`}>
        <h2>{language === 'En' ? 'Upload Assignment' : 'رفع التكليف'}</h2>
        <form onSubmit={handleSubmit} className="UploadAssignment_form">
          <h3>
            {language === 'En' ? 'Select Course:' : 'اختر الدورة الدراسية:'}
          </h3>
          <div className="UploadAssignment_form-group">
            <select
                id="courseSelect"
                value={selectedCourse}
                onChange={handleCourseChange}
                required
            >
              <option value="" disabled>
                {language === 'En' ? 'Select course' : 'اختر الدورة الدراسية'
                }</option>
              {courses.map((course, index) => (
                  <option key={index} value={course.course_code}>
                    {course.course_name}
                  </option>
              ))}
            </select>
          </div>

          {selectedCourse && (
              <>
                <div className="UploadAssignment_form-group">
                  <label htmlFor="assignmentSelect">{language === 'En' ? 'Select Assignment:' : 'اختر الواجب:'}</label>
                  <select
                      id="assignmentSelect"
                      value={selectedAssignment ? selectedAssignment.assignment_id : ''}
                      onChange={handleAssignmentChange}
                      required
                  >
                    <option value="" disabled>{language === 'En' ? 'Select assignment' : 'اختر الواجب'}</option>
                    {assignments.map((assignment) => (
                        <option key={assignment.assignment_id} value={assignment.assignment_id}>
                          {assignment.assignment_title}
                        </option>
                    ))}
                  </select>
                </div>

                {selectedAssignment && (
                    <>
                      {selectedAssignment.description && (
                          <div className="UploadAssignment_form-group">
                            <p>
                              <strong>{language === 'En' ? 'Description:' : 'الوصف:'}</strong>
                            </p>
                            <p>
                              {selectedAssignment.description}
                            </p>
                          </div>
                      )}

                      {selectedAssignment.assignment_file && (
                          <div className="UploadAssignment_form-group">
                            <p>
                              <strong>{language === 'En' ? 'Assignment File:' : 'ملف التكليف:'}</strong>
                            </p>
                            <div>
                              <button onClick={() => handleView(selectedAssignment.assignment_id)}>
                                {language === 'En' ? 'View:' : 'عرض:'}
                                <SlBookOpen/>
                              </button>
                              <button
                                  onClick={() => handleDownload(selectedAssignment.assignment_id, selectedAssignment.assignment_file_name)}>
                                {language === 'En' ? 'Download:' : 'تنزيل:'}
                                <SlCloudDownload/>
                              </button>
                            </div>
                          </div>
                      )}

                      <div className="UploadAssignment_form-group">
                        {fileErrMessage && (
                            <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{fileErrMessage}</p>
                        )}
                        <label
                            htmlFor="studentFile">{language === 'En' ? 'Upload Your File:' : 'رفع الملف الخاص بك:'}</label>
                        <input type="file" id="studentFile" onChange={handleFileChange}/>
                      </div>

                      <button type="submit">{language === 'En' ? 'Upload' : 'رفع'}</button>

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

                    </>
                )}
              </>
          )}
        </form>
      </div>
  );
};

export default Assignments;
