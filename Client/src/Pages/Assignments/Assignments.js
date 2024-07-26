import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Assignments.css';
import axios from 'axios';

const Assignments = ({ isDarkMode, language, userRole, userId }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4001/api/student/${userId}/courses`)
        .then(response => setCourses(response.data))
        .catch(error => console.error('Error fetching courses:', error));
  }, [userRole, userId]);

  console.log("courses: ", courses);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch assignments for the selected course from backend
      axios.get(`http://localhost:4001/assignments/${selectedCourse}`)
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
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', studentFile);
    formData.append('courseId', selectedCourse);
    formData.append('assignmentId', selectedAssignment.assignment_id);
    formData.append('instructorCourseId', selectedAssignment.instructor_course_id);

    axios.post('http://localhost:4001/upload-student-assignment', formData)
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

  return (
      <div className={`upload-student-assignment ${isDarkMode ? 'dark' : 'light'} ${language === 'Ar' ? 'rtl' : ''}`}>
        <h2>{language === 'En' ? 'Upload Assignment' : 'رفع الواجب'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseSelect">{language === 'En' ? 'Select Course:' : 'اختر الدورة الدراسية:'}</label>
            <select id="courseSelect" value={selectedCourse} onChange={handleCourseChange} required>
              <option value="" disabled>{language === 'En' ? 'Select course' : 'اختر الدورة الدراسية'}</option>
              {courses.map((course, index) => (
                  <option key={index} value={course.course_code}>{course.course_name}</option>
              ))}
            </select>
          </div>

          {selectedCourse && (
              <>
                <div className="form-group">
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
                    <div className="assignment-description">
                      <p><strong>{language === 'En' ? 'Description:' : 'الوصف:'}</strong> {selectedAssignment.description}</p>
                    </div>
                )}

                <div className="form-group">
                  <label htmlFor="studentFile">{language === 'En' ? 'Upload Your File:' : 'رفع الملف الخاص بك:'}</label>
                  <input type="file" id="studentFile" onChange={handleFileChange} required />
                </div>

                <button type="submit">{language === 'En' ? 'Upload' : 'رفع'}</button>
              </>
          )}
        </form>

        {userRole === 'instructor' && (
            <Link to="/upload-assignment">
              <button className="upload-assignment-button">{language === 'En' ? 'Upload Assignment' : 'رفع واجب'}</button>
            </Link>
        )}
      </div>
  );
};

export default Assignments;
