import { useState, useEffect, useContext } from 'react';
import './Assignments.css';
import axios from '../../api/axios';
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";

const Assignments = () => {
  const { isDarkMode, language, role, userId } = useContext(UserContext);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [fileErrMessage, setFileErrMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [canUpload, setCanUpload] = useState(true); // State to track if the due date allows uploads

  useEffect(() => {
    axios.get(`/api/student/${userId}/courses`)
        .then(response => setCourses(response.data))
        .catch(error => toast.error('Error fetching courses:', error));
  }, [role, userId]);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch assignments for the selected course from backend
      axios.get(`/api/assignments/${selectedCourse}`)
          .then(response => setAssignments(response.data))
          .catch(error => toast.error('Error fetching assignments:', error));
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedAssignment) {
      // Check assignment submission status
      axios.get('/api/studentAssignment/checkAssignmentSubmission', {
        params: {
          assignmentId: selectedAssignment.assignment_id,
          userId,
          instructorCourseId: selectedAssignment.instructors_courses_id
        },
      })
          .then(response => {
            setIsSubmitted(response.data);
          })
          .catch(error => {
            toast.error('Error checking submission status:', error);
          });

      // Set up a timer to check the due date every minute
      const interval = setInterval(() => {
        setCanUpload(checkDueDate(selectedAssignment.due_date));
      }, 60000);

      // Initial check
      setCanUpload(checkDueDate(selectedAssignment.due_date));

      // Cleanup timer on component unmount or when selectedAssignment changes
      return () => clearInterval(interval);
    }
  }, [selectedAssignment, userId]);

  const handleCourseChange = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    setSelectedAssignment(null);
  };

  const handleAssignmentChange = (e) => {
    const assignmentId = parseInt(e.target.value, 10);
    const assignment = assignments.find((a) => a.assignment_id === assignmentId);
    setSelectedAssignment(assignment);
    setFileErrMessage('');
  };

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
          toast.success(language === 'En' ? 'Assignment uploaded successfully!' : 'تم رفع الواجب بنجاح!');
          // Clear form after submission
          setSelectedCourse('');
          setSelectedAssignment(null);
          setStudentFile(null);
        })
        .catch(error => {
          toast.error(language === 'En' ? 'Failed to upload assignment!' : 'فشل في رفع الواجب!');
        });
  };

  const checkDueDate = (dueDate) => {
    return new Date() <= new Date(dueDate);
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
                {language === 'En' ? 'Select course' : 'اختر الدورة الدراسية'}
              </option>
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
                      {canUpload ? (
                          <>
                            <div className="UploadAssignment_form-group">
                              {fileErrMessage && (
                                  <p style={{
                                    color: 'red',
                                    marginBottom: '8px',
                                    fontStyle: 'italic'
                                  }}>{fileErrMessage}</p>
                              )}
                              {isSubmitted ? (
                                  <>
                                    <p style={{
                                      color: 'green',
                                      marginBottom: '8px',
                                      fontStyle: 'italic'
                                    }}>{language === 'En' ? 'You already uploaded this assignment' : 'لقد قمت بالفعل برفع هذا التكليف'}</p>
                                    <label
                                        htmlFor="studentFile">{language === 'En' ? 'Change Your File:' : 'تغيير الملف الخاص بك:'}
                                    </label>
                                  </>
                              ) : (
                                  <label
                                      htmlFor="studentFile">{language === 'En' ? 'Upload Your File:' : 'رفع الملف الخاص بك:'}
                                  </label>
                              )}
                              <input type="file" id="studentFile" onChange={handleFileChange} />
                            </div>

                            {isSubmitted ? (
                                <button type="submit">{language === 'En' ? 'Change file' : 'تغيير الملف'}</button>
                            ) : (
                                <button type="submit">{language === 'En' ? 'Upload' : 'رفع'}</button>
                            )}
                          </>
                      ) : (
                          <div className="UploadAssignment_form-group">
                            {language === 'En' ?
                                'The deadline for submitting the assignment has passed.' :
                                'لقد انتهى الموعد النهائي لتسليم المهمة'}
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
