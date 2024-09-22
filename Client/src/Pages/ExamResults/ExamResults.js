import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import CourseSelect from './CourseSelect';
import styles from './ExamResults.module.css';
import {StudentsAssignments, StudentsExams, StudentsInfo} from "../../components";
import allNotifications from "../AllNotifications/AllNotifications";

function ExamResults({ language, isDarkMode, Role, userId }) {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [selectedExam, setSelectedExam] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/instructor/${userId}/courses`);

                if (Array.isArray(response.data)) {
                    setCourses(response.data);
                } else {
                    console.error('Expected array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId, Role]);

    const handleCourseSelect = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedOption('');
        setStudents([]);
        setAssignments([]);
        setExams([]);
    };

    const handleOptionSelect = async (option) => {
        setSelectedOption(option);
        setStudents([]);
        if (option === 'assignments') {
            const response = await axios.get(`/api/assignments/${selectedCourse}`);
            setAssignments(response.data);
        } else if (option === 'exams') {
            const response = await axios.get(`/api/exams/${selectedCourse}`);
            setExams(response.data);
        }
    };

    const handleAssignmentSelect = (assignmentId) => {
        setSelectedAssignment(assignmentId);
        axios.get(`/api/assignments/${assignmentId}/students`)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    };

    const handleExamSelect = (examId) => {
        setSelectedExam(examId);
        axios.get(`/api/exam-results/${examId}`)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam results:', error);
            });
    };

    const handleEnrollmentsSelect = () => {
        axios.get(`/api/enrollments/${selectedCourse}/${userId}`)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching enrollments:', error);
            });
    };
    console.log("exams data: ", exams);
    console.log("course id: ", selectedCourse);

    return (
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            <h1>{language === 'En' ? 'Exam Results' : 'نتائج الامتحانات'}</h1>
            <div className={styles.selectContainer}>
                <CourseSelect courses={courses} onSelect={handleCourseSelect} language={language} />
                {selectedCourse && (
                    <select onChange={(e) => handleOptionSelect(e.target.value)} value={selectedOption}>
                        <option value="">{language === 'En' ? 'Select Option' : 'اختر الخيار'}</option>
                        <option value="enrollments">{language === 'En' ? 'Students\' Enrollments' : 'تسجيلات الطلاب'}</option>
                        <option value="assignments">{language === 'En' ? 'Student Assignments' : 'واجبات الطلاب'}</option>
                        <option value="exams">{language === 'En' ? 'Student Exams' : 'امتحانات الطلاب'}</option>
                    </select>
                )}
                {selectedOption === 'assignments' && (
                    <select onChange={(e) => handleAssignmentSelect(e.target.value)} value={selectedAssignment}>
                        <option value="">{language === 'En' ? 'Select Assignment' : 'اختر الواجب'}</option>
                        {assignments.map((assignment) => (
                            <option key={assignment.assignment_id} value={assignment.assignment_id}>
                                {assignment.assignment_title}
                            </option>
                        ))}
                    </select>
                )}
                {selectedOption === 'exams' && (
                    <select onChange={(e) => handleExamSelect(e.target.value)} value={selectedExam}>
                        <option value="">{language === 'En' ? 'Select Exam' : 'اختر الامتحان'}</option>
                        {exams.map((exam) => (
                            <option key={exam.examId} value={exam.examId}>
                                {exam.examName}
                            </option>
                        ))}
                    </select>
                )}
                {selectedOption === 'enrollments' && (
                    <button onClick={handleEnrollmentsSelect}>{language === 'En' ? 'Show Enrollments' : 'عرض التسجيلات'}</button>
                )}
            </div>
            {selectedOption === 'enrollments' && students.length > 0 ? (
                <StudentsInfo students={students} language={language} />
            ) : (selectedOption === 'assignments' && students.length > 0 ? (
                <StudentsAssignments students={students} assignmentId={selectedAssignment} language={language} />
            ) : (selectedOption === 'exams' && students.length > 0 ? (
                <StudentsExams students={students} examId={selectedExam} language={language} />
            ) : null))}
        </div>
    );
}

export default ExamResults;
