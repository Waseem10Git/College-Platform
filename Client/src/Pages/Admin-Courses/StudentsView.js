import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorsView = ({ language }) => {
    const [studentsEnrollments, setStudentsEnrollments] = useState([]);
    const [instructorsCourses, setInstructorsCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [newInstructorCourse, setNewInstructorCourse] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');

    const fetchInstructorsCourses = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/students-enrollments');
            setStudentsEnrollments(response.data);
        } catch (err) {
            console.error('Error fetching enrollments data:', err);
            toast.error(language === 'En' ? 'Error fetching enrollments data' : 'خطأ في جلب بيانات التسجيلات');
        }
    };

    useEffect(() => {
        fetchInstructorsCourses();

        axios.get('http://localhost:4001/api/instructors-departments-courses')
            .then(response => {
                setInstructorsCourses(response.data);
            })
            .catch(err => {
                console.error('Error fetching instructors-courses data:', err);
                toast.error(language === 'En' ? 'Error fetching departments-courses data' : 'خطأ في جلب بيانات الأقسام والمدربين');
            });

        axios.get('http://localhost:4001/api/students')
            .then(response => {
                setStudents(response.data);
            })
            .catch(err => {
                console.error('Error fetching students data:', err);
                toast.error(language === 'En' ? 'Error fetching students data' : 'خطأ في جلب بيانات الطلاب');
            });
    }, []);
    console.log("students: ", students);
    console.log("instructors courses: ", instructorsCourses);
    console.log("enrollments : ", studentsEnrollments);

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://localhost:4001/api/students-enrollments', {
                student_id: selectedStudent,
                instructor_course_ids: newInstructorCourse
            });
            if (response.data.success) {
                fetchInstructorsCourses();
                resetForm();
                toast.success(language === 'En' ? 'Added successfully!' : 'تمت الإضافة بنجاح!');
            }
        } catch (error) {
            console.error('Error adding instructor-course relation:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                error.response.data.errors.forEach(errMsg => {
                    toast.error(errMsg);
                });
            } else {
                toast.error(language === 'En' ? 'Error adding instructor-course relation' : 'خطأ في إضافة العلاقة بين الطالب والدورة');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4001/api/students-enrollments/${id}`);
            fetchInstructorsCourses();
            toast.success(language === 'En' ? 'Deleted successfully!' : 'تم الحذف بنجاح!');
        } catch (error) {
            console.error('Error deleting instructor-course relation:', error);
            toast.error(language === 'En' ? 'Error deleting instructor-course relation' : 'خطأ في حذف العلاقة بين المدرب والدورة');
        }
    };

    const resetForm = () => {
        setSelectedStudent('');
        setNewInstructorCourse([]);
    };

    return (
        <>
            <ToastContainer />
            <table className="course-table">
                <thead>
                <tr>
                    <th>{language === 'En' ? 'Student Name' : 'اسم الدكتور'}</th>
                    <th>{language === 'En' ? 'Course_Instructor' : 'الدورة_المدرب'}</th>
                    <th>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                            <option value="">{language === 'En' ? 'Select Student' : 'اختر الطالب'}</option>
                            {students.map((student, index) => (
                                <option key={index} value={student.id}>{student.first_name} {student.last_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select multiple value={newInstructorCourse}
                                onChange={(e) => setNewInstructorCourse(
                                    [...e.target.options].filter(option => option.selected).map(option => option.value))}
                        >
                            {instructorsCourses.map(ic => (
                                <option key={ic.id} value={ic.instructor_course_id}>{ic.first_name} {ic.last_name}_{ic.course_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <button onClick={handleAdd}>
                            {language === 'En' ? 'Add' : 'اضافة'}
                        </button>
                    </td>
                </tr>
                {studentsEnrollments.map((se, index) => (
                    <tr key={index}>
                        <td>
                            {se.student_fname} {se.student_lname}
                        </td>
                        <td>
                            {se.instructor_fname} {se.instructor_lname}_{se.course_name}
                        </td>
                        <td>
                            <button onClick={() => handleDelete(se.id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default InstructorsView;
