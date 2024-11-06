import React, {useState, useEffect, useContext} from 'react';
import { toast } from 'react-toastify';
import UserContext from "../../context/UserContext";
import instructorsCoursesApi from "../../api/instructorsCoursesApi";
import departmentsCoursesApi from "../../api/departmentsCoursesApi";
import usersApi from "../../api/usersApi";
import {ConfirmDelete} from "../../components";

const InstructorsView = () => {
    const { language } = useContext(UserContext);
    const [instructorsCourses, setInstructorsCourses] = useState([]);
    const [departmentsCourses, setDepartmentsCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newDepartmentCourse, setNewDepartmentCourse] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [addingErrInstructorMessage, setAddingErrInstructorMessage] = useState('');
    const [addingErrCoursesMessage, setAddingErrCoursesMessage] = useState('');
    const [addingExistErr, setAddingExistErr] = useState('');
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);

    const fetchInstructorsCourses = async () => {
        try {
            const response = await instructorsCoursesApi.fetchData();
            setInstructorsCourses(response.data);
        } catch (err) {
            console.error('Error fetching instructors-courses data:', err);
            toast.error(language === 'En' ? 'Error fetching instructors-courses data' : 'خطأ في جلب بيانات الدورات والمدربين');
        }
    };

    const fetchDepartmentsCourses = async () => {
        try {
            const res = await departmentsCoursesApi.fetchDepartmentsCourses();
            setDepartmentsCourses(res.data);
        } catch (err) {
            console.error('Error fetching departments-courses data:', err);
            toast.error(language === 'En' ? 'Error fetching departments-courses data' : 'خطأ في جلب بيانات الأقسام والدورات');
        }
    };

    const fetchInstructors = async () => {
        try {
            const res = await usersApi.fetchInstructors();
            setInstructors(res.data);
        } catch (err) {
            console.error('Error fetching instructors data:', err);
            toast.error(language === 'En' ? 'Error fetching instructors data' : 'خطأ في جلب بيانات المدربين');
        }
    };

    useEffect(() => {
        fetchInstructorsCourses();
        fetchDepartmentsCourses();
        fetchInstructors();
    }, []);

    const validateAdding = (instructor, courses) => {
        if (!instructor) {
            setAddingErrInstructorMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (courses.length <= 0) {
            setAddingErrCoursesMessage(language === 'En' ? 'Please select an item(s) in each list.' : 'يرجى اختيار عنصر(عناصر) في كل قائمة.');
            return false;
        }

        const isDuplicate = instructorsCourses.some(
            ic => ic.user_id.toString() === instructor && courses.some(c => c === ic.department_course_id)
        );

        if (isDuplicate) {
            setAddingExistErr(language === 'En' ? 'This course(s) enrolled to the this student.' : 'تم تسجيل هذه الدورة (الدورات) لهذا الطالب.');
            return false;
        }

        return true;
    };

    const handleAdd = async () => {
        setAddingErrInstructorMessage('');
        setAddingErrCoursesMessage('');
        setAddingExistErr('');
        try {
            if (!validateAdding(selectedInstructor, newDepartmentCourse)) return;
            console.log(selectedInstructor, newDepartmentCourse, instructorsCourses)

            const response = await instructorsCoursesApi.addInstructorCourse(selectedInstructor, newDepartmentCourse);
            if (response.data.success) {
                fetchInstructorsCourses();
                resetForm();
                toast.success(language === 'En' ? 'Adding instructor-course relation successfully!' : 'تمت إضافة علاقة المدرب بالمقرر بنجاح!');
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
        setAddingErrInstructorMessage('');
        setAddingErrCoursesMessage('');
        setAddingExistErr('');
        try {
            await instructorsCoursesApi.deleteInstructorCourse(id);
            fetchInstructorsCourses();
            toast.success(language === 'En' ? 'Deleting instructor-course relation successfully!' : 'تم حذف العلاقة بين المدرب والمقرر بنجاح!');
        } catch (error) {
            console.error('Error deleting instructor-course relation:', error);
            toast.error(language === 'En' ? 'Error deleting instructor-course relation' : 'خطأ في حذف العلاقة بين المدرب والدورة');
        }
    };

    const confirmDelete = (id) => {
        setDepartmentToDelete(id);
        setDeletionVisible(true);
    };

    const resetForm = () => {
        setSelectedInstructor('');
        setNewDepartmentCourse([]);
        setAddingErrInstructorMessage('');
        setAddingErrCoursesMessage('');
        setAddingExistErr('');
    };

    return (
        <>
            <table className="InstructorsView_course-table">
                <thead>
                <tr>
                    <th>{language === 'En' ? 'Instructor Name' : 'اسم الدكتور'}</th>
                    <th>{language === 'En' ? 'Department_Course' : 'القسم_الدورة'}</th>
                    <th>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{addingErrInstructorMessage && (
                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingErrInstructorMessage}</p>
                    )}
                        <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)}>
                            <option value="">{language === 'En' ? 'Select Instructor' : 'اختر الدكتور'}</option>
                            {instructors.map((instructor, index) => (
                                <option key={index} value={instructor.id}>{instructor.first_name} {instructor.last_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>{addingErrCoursesMessage && (
                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingErrCoursesMessage}</p>
                    )}
                        <select multiple value={newDepartmentCourse}
                                onChange={(e) => setNewDepartmentCourse(
                                    [...e.target.options].filter(option => option.selected).map(option => option.value))}
                        >
                            {departmentsCourses.map((dc, index) => (
                                <option key={index} value={dc.id}>{dc.department_name}_{dc.course_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>{addingExistErr && (
                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingExistErr}</p>
                    )}
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
                            {ic.department_name + "_" + ic.course_name}
                        </td>
                        <td>
                            <button onClick={() => confirmDelete(ic.instructor_course_id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {deletionVisible && (
                <ConfirmDelete
                    deletionVisible={deletionVisible}
                    setDeletionVisible={setDeletionVisible}
                    handleDelete={() => handleDelete(departmentToDelete)}
                />
            )}
        </>
    );
};

export default InstructorsView;
