import {useContext, useEffect, useState} from 'react';
import CourseSelect from './CourseSelect';
import  './ExamResults.css';
import {StudentsAssignments, StudentsExams, StudentsInfo} from "../../components";
import UserContext from "../../context/UserContext";
import coursesApi from "../../api/coursesApi";
import assignmentsApi from "../../api/assignmentsApi";
import examApi from "../../api/examApi";
import enrollmentsApi from "../../api/enrollmentsApi";

function ExamResults() {
    const { language, isDarkMode, role, userId } = useContext(UserContext);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [viewExamDetails, setViewExamDetails] = useState(false);

    const fetchCourses = async () => {
        try {
            console.log(role, userId);
            const response = await coursesApi.fetchSomeCourses(role, userId);

            if (Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                console.error('Expected array but got:', response.data);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [userId, role]);

    const handleCourseSelect = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedOption('');
        setStudents([]);
        setAssignments([]);
        setExams([]);
    };

    const handleOptionSelect = async (option) => {
        setSelectedOption(option);
        setSelectedAssignment('');
        setSelectedExam('');
        setStudents([]);
        if (option === 'assignments') {
            const response = await assignmentsApi.fetchAssignmentsForCourse(selectedCourse);
            setAssignments(response.data);
        } else if (option === 'exams') {
            const response = await examApi.fetchExamsForCourse(selectedCourse);
            setExams(response.data);
        }
    };

    const handleAssignmentSelect = (assignmentId) => {
        setSelectedAssignment(assignmentId);
        setSelectedExam('');
        assignmentsApi.fetchAssignmentsWithStudents(assignmentId)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    };

    const handleExamSelect = (examId) => {
        setSelectedExam(examId);
        setSelectedAssignment('');
        examApi.fetchExamsWithStudents(examId)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam results:', error);
            });
    };

    const handleEnrollmentsSelect = () => {
        enrollmentsApi.fetchStudentsEnrolledInCourse(selectedCourse, userId)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching enrollments:', error);
            });
    };
    // console.log("exams data: ", exams);
    console.log("course id: ", selectedCourse);
    console.log("students: ", students);

    return (
        <div className={`examResults ${isDarkMode ? 'examResults_dark-mode' : 'examResults_light-mode'}`}>
            <div className="examResults_selectContainer">
                <h3 className='examResults_h2'>{language === 'En' ? 'Students/Result' : 'نتائج/الطلاب'}</h3>
                {!viewExamDetails ? (
                    <>
                        <CourseSelect courses={courses} onSelect={handleCourseSelect} language={language}
                                      isDarkMode={isDarkMode}/>
                        {selectedCourse && (
                            <select onChange={(e) => handleOptionSelect(e.target.value)} value={selectedOption}>
                                <option value="" disabled>{language === 'En' ? 'Select Option' : 'اختر الخيار'}</option>
                                <option value="enrollments">{language === 'En' ? 'Student Information' : 'بيانات الطلاب'}</option>
                                <option value="assignments">{language === 'En' ? 'Student Assignments' : 'واجبات الطلاب'}</option>
                                <option value="exams">{language === 'En' ? 'Student Exams' : 'امتحانات الطلاب'}</option>
                            </select>
                        )}
                        {selectedOption === 'assignments' && (
                            <select onChange={(e) => handleAssignmentSelect(e.target.value)} value={selectedAssignment}>
                                <option value="" disabled>{language === 'En' ? 'Select Assignment' : 'اختر الواجب'}</option>
                                {assignments.map((assignment) => (
                                    <option key={assignment.assignment_id} value={assignment.assignment_id}>
                                        {assignment.assignment_title}
                                    </option>
                                ))}
                            </select>
                        )}
                        {selectedOption === 'exams' && (
                            <select onChange={(e) => handleExamSelect(e.target.value)} value={selectedExam}>
                                <option value="" disabled>{language === 'En' ? 'Select Exam' : 'اختر الامتحان'}</option>
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
                    </>
                ) : null}
                {
                    selectedOption === 'enrollments' ? (
                        <StudentsInfo students={students} language={language}/>
                    ) : selectedOption === 'assignments' ? (
                        <StudentsAssignments students={students} assignmentId={selectedAssignment} language={language} refreshData={() => handleAssignmentSelect(selectedAssignment)}/>
                    ) : (selectedOption === 'exams' ? (
                        <StudentsExams students={students} examId={selectedExam} language={language} refreshData={() => handleExamSelect(selectedExam)} viewExamDetails={viewExamDetails} setViewExamDetails={setViewExamDetails}/>
                    ) : null)
                }
            </div>
        </div>
    );
}

export default ExamResults;
