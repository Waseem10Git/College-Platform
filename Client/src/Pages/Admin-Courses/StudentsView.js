import React, {useState, useEffect, useContext} from 'react';
import { toast } from 'react-toastify';
import UserContext from "../../context/UserContext";
import studentsEnrollmentsApi from "../../api/studentsEnrollmentsApi";
import instructorsCoursesApi from "../../api/instructorsCoursesApi";
import usersApi from "../../api/usersApi";
import {ConfirmDelete, SearchBar} from "../../components";

const InstructorsView = () => {
    const { language } = useContext(UserContext);
    const [studentsEnrollments, setStudentsEnrollments] = useState([]);
    const [instructorsCourses, setInstructorsCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [newStudentEnrollment, setNewStudentEnrollment] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [addingErrStudentsMessage, setAddingErrStudentsMessage] = useState('');
    const [addingErrCoursesMessage, setAddingErrCoursesMessage] = useState('');
    const [addingExistErr, setAddingExistErr] = useState('');
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [filter, setFilter] = useState('');

    const fetchStudentsEnrollments = async () => {
        try {
            const response = await studentsEnrollmentsApi.fetchStudentsEnrollments();
            setStudentsEnrollments(response.data);
        } catch (err) {
            console.error('Error fetching enrollments data:', err);
            toast.error(language === 'En' ? 'Error fetching enrollments data' : 'خطأ في جلب بيانات التسجيلات');
        }
    };

    const fetchInstructorsCourses = async () => {
        try {
            const response = await instructorsCoursesApi.fetchData();
            setInstructorsCourses(response.data);
        } catch (err) {
            toast.error(language === 'En' ? 'Error fetching departments-courses data' : 'خطأ في جلب بيانات الأقسام والمدرسين');
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await usersApi.fetchStudents();
            setStudents(response.data);
        } catch (err) {
            toast.error(language === 'En' ? 'Error fetching students data' : 'خطأ في جلب بيانات الطلاب');
        }
    };

    useEffect(() => {
        fetchStudentsEnrollments();
        fetchInstructorsCourses();
        fetchStudents();
    }, []);

    const validateAdding = (student, newStudentEnrollment) => {
        if (!student) {
            setAddingErrStudentsMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (newStudentEnrollment <= 0) {
            setAddingErrCoursesMessage(language === 'En' ? 'Please select an item(s) in each list.' : 'يرجى اختيار عنصر(عناصر) في كل قائمة.');
            return false;
        }

        const isDuplicate = studentsEnrollments.some(
            se => se.student_id.toString() === student && newStudentEnrollment.some(nse => nse === se.instructor_course_id)
        );

        if (isDuplicate) {
            setAddingExistErr(language === 'En' ? 'This course(s) enrolled to the this student.' : 'تم تسجيل هذه المادة (المواد) لهذا الطالب.');
            return false;
        }

        return true;
    };

    const handleAdd = async () => {
        setAddingErrStudentsMessage('');
        setAddingErrCoursesMessage('');
        setAddingExistErr('');

        try {
            if (!validateAdding(selectedStudent, newStudentEnrollment)) return;

            const response = await studentsEnrollmentsApi.enrollStudent(selectedStudent, newStudentEnrollment);
            if (response.data.success) {
                fetchStudentsEnrollments();
                resetForm();
                toast.success(language === 'En' ? 'Adding student-course relation successfully' : 'تم إضافة العلاقة بين الطالب والمادة بنجاح');
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                toast.error(language === 'En' ? error.response.data.EnMessage : error.response.data.ArMessage);
            } else {
                toast.error(language === 'En' ? 'Error adding student-course relation' : 'خطأ في إضافة العلاقة بين الطالب والمادة');
            }
        }
    };

    const handleDelete = async (id) => {
        setAddingErrStudentsMessage('');
        setAddingErrCoursesMessage('');
        setAddingExistErr('');
        try {
            const response = await studentsEnrollmentsApi.deleteStudentEnrollment(id);
            if (response.data.success) {
                fetchStudentsEnrollments();
                toast.success(language === 'En' ? 'Deleting student-course relation successfully' : 'تم حذف العلاقة بين الطالب والمادة بنجا!');
            }
        } catch (error) {
            toast.error(language === 'En' ? 'Error deleting student-course relation' : 'خطأ في حذف العلاقة بين الطالب والمادة');
        }
    };

    const confirmDelete = (id) => {
        setDepartmentToDelete(id);
        setDeletionVisible(true);
    };

    const resetForm = () => {
        setSelectedStudent('');
        setNewStudentEnrollment([]);
    };

    const filteredData = studentsEnrollments.filter((se) =>
        (se.student_fname && se.student_fname.toLowerCase().includes(filter)) ||
        (se.student_lname && se.student_lname.toLowerCase().includes(filter)) ||
        (se.instructor_fname && se.instructor_fname.toLowerCase().includes(filter)) ||
        (se.instructor_lname && se.instructor_lname.toLowerCase().includes(filter)) ||
        (se.course_name && se.course_name.toLowerCase().includes(filter))
    );

    return (
        <>
            <div>
                <SearchBar
                    filter={filter}
                    setFilter={setFilter}
                    searchText={language === "En"
                        ? "Search by students first/last name, doctor first/last name or course name"
                        : "البحث حسب الاسم الأول/الأخير للطالب، أو الاسم الأول/الأخير للمدرس أو اسم المادة"}
                />
            </div>
            <table className="StudentsView_course-table">
                <thead>
                <tr>
                    <th>{language === 'En' ? 'Student Name' : 'اسم الدكتور'}</th>
                    <th>{language === 'En' ? 'Course_Instructor' : 'المادة_المدرس'}</th>
                    <th>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        {addingErrStudentsMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrStudentsMessage}</p>
                        )}
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                            <option value="">{language === 'En' ? 'Select Student' : 'اختر الطالب'}</option>
                            {students.map((student, index) => (
                                <option key={index} value={student.id}>{student.first_name} {student.last_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {addingErrCoursesMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrCoursesMessage}</p>
                        )}
                        <select multiple value={newStudentEnrollment}
                                onChange={(e) => setNewStudentEnrollment(
                                    [...e.target.options].filter(option => option.selected).map(option => option.value))}
                        >
                            {instructorsCourses.map(ic => (
                                <option key={ic.id}
                                        value={ic.instructor_course_id}>{ic.first_name} {ic.last_name}_{ic.course_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {addingExistErr && (
                            <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingExistErr}</p>
                        )}
                        <button id={'AdminCourses_add-button'} onClick={handleAdd}>
                            {language === 'En' ? 'Add' : 'اضافة'}
                        </button>
                    </td>
                </tr>
                {filteredData && filteredData.map((se, index) => (
                    <tr key={index}>
                        <td>
                            {se.student_fname} {se.student_lname}
                        </td>
                        <td>
                            {se.instructor_fname} {se.instructor_lname}_{se.course_name}
                        </td>
                        <td>
                            <button id={'AdminCourses_delete-button'} onClick={() => confirmDelete(se.id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
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
