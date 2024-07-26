import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorsView = ({ language }) => {
    const [instructorsCourses, setInstructorsCourses] = useState([]);
    const [departmentsCourses, setDepartmentsCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newDepartmentCourse, setNewDepartmentCourse] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');

    const fetchInstructorsCourses = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/instructors-departments-courses');
            setInstructorsCourses(response.data);
        } catch (err) {
            console.error('Error fetching instructors-courses data:', err);
            toast.error(language === 'En' ? 'Error fetching instructors-courses data' : 'خطأ في جلب بيانات الدورات والمدربين');
        }
    };

    useEffect(() => {
        fetchInstructorsCourses();
        axios.get('http://localhost:4001/api/departments-courses')
            .then(response => {
                setDepartmentsCourses(response.data);
            })
            .catch(err => {
                console.error('Error fetching departments-courses data:', err);
                toast.error(language === 'En' ? 'Error fetching departments-courses data' : 'خطأ في جلب بيانات الأقسام والدورات');
            });

        axios.get('http://localhost:4001/api/instructors')
            .then(response => {
                setInstructors(response.data);
            })
            .catch(err => {
                console.error('Error fetching instructors data:', err);
                toast.error(language === 'En' ? 'Error fetching instructors data' : 'خطأ في جلب بيانات المدربين');
            });
    }, []);

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://localhost:4001/api/instructors-enrollments', {
                instructor_id: selectedInstructor,
                department_course_ids: newDepartmentCourse
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
                toast.error(language === 'En' ? 'Error adding instructor-course relation' : 'خطأ في إضافة العلاقة بين المدرب والدورة');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4001/api/instructors-enrollments/${id}`);
            fetchInstructorsCourses();
            toast.success(language === 'En' ? 'Deleted successfully!' : 'تم الحذف بنجاح!');
        } catch (error) {
            console.error('Error deleting instructor-course relation:', error);
            toast.error(language === 'En' ? 'Error deleting instructor-course relation' : 'خطأ في حذف العلاقة بين المدرب والدورة');
        }
    };

    const resetForm = () => {
        setSelectedInstructor('');
        setNewDepartmentCourse([]);
    };

    return (
        <>
            <ToastContainer />
            <table className="course-table">
                <thead>
                <tr>
                    <th>{language === 'En' ? 'Instructor Name' : 'اسم الدكتور'}</th>
                    <th>{language === 'En' ? 'Course_Department' : 'الدورة_القسم'}</th>
                    <th>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)}>
                            <option value="">{language === 'En' ? 'Select Instructor' : 'اختر الدكتور'}</option>
                            {instructors.map((instructor, index) => (
                                <option key={index} value={instructor.id}>{instructor.first_name} {instructor.last_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select multiple value={newDepartmentCourse}
                                onChange={(e) => setNewDepartmentCourse(
                                    [...e.target.options].filter(option => option.selected).map(option => option.value))}
                        >
                            {departmentsCourses.map(dc => (
                                <option key={dc.id} value={dc.id}>{dc.course_name}_{dc.department_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <button onClick={handleAdd}>
                            {language === 'En' ? 'Add' : 'اضافة'}
                        </button>
                    </td>
                </tr>
                {instructorsCourses.map((ic, index) => (
                    <tr key={index}>
                        <td>
                            {ic.first_name} {ic.last_name}
                        </td>
                        <td>
                            {ic.course_name + "_" + ic.department_name}
                        </td>
                        <td>
                            <button onClick={() => handleDelete(ic.instructor_course_id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default InstructorsView;
