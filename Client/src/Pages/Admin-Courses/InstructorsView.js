import React, {useState, useEffect, useContext} from 'react';
import { toast } from 'react-toastify';
import UserContext from "../../context/UserContext";
import instructorsCoursesApi from "../../api/instructorsCoursesApi";
import departmentsCoursesApi from "../../api/departmentsCoursesApi";
import usersApi from "../../api/usersApi";
import {ConfirmDelete, SearchBar} from "../../components";

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
    const [filter, setFilter] = useState('');

    const fetchInstructorsCourses = async () => {
        try {
            const response = await instructorsCoursesApi.fetchData();
            setInstructorsCourses(response.data);
        } catch (err) {
            toast.error(language === 'En' ? 'Error fetching instructors-courses data' : 'خطأ في جلب بيانات المواد والمدرسين');
        }
    };

    const fetchDepartmentsCourses = async () => {
        try {
            const res = await departmentsCoursesApi.fetchDepartmentsCourses();
            setDepartmentsCourses(res.data);
        } catch (err) {
            toast.error(language === 'En' ? 'Error fetching departments-courses data' : 'خطأ في جلب بيانات الأقسام والمواد');
        }
    };

    const fetchInstructors = async () => {
        try {
            const res = await usersApi.fetchInstructors();
            setInstructors(res.data);
        } catch (err) {
            toast.error(language === 'En' ? 'Error fetching instructors data' : 'خطأ في جلب بيانات المدرسين');
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
            setAddingExistErr(language === 'En' ? 'This course(s) enrolled to the this instructor.' : 'تم تسجيل هذه المادة (المواد) لهذا المدرس.');
            return false;
        }

        const isCourseTaken = instructorsCourses.some((ic) =>
            courses.some((c) => c === ic.department_course_id)
        );

        if (isCourseTaken) {
            setAddingExistErr(
                language === 'En'
                    ? 'The course(s) already assigned.'
                    : 'تم تعيين المادة (المواد) بالفعل.'
            );
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

            const response = await instructorsCoursesApi.addInstructorCourse(selectedInstructor, newDepartmentCourse);
            if (response.data.success) {
                fetchInstructorsCourses();
                resetForm();
                toast.success(language === 'En' ? 'Adding instructor-course relation successfully' : 'تمت إضافة علاقة المدرس بالمقرر بنجاح');
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                toast.error(language === 'En' ? error.response.data.EnMessage : error.response.data.ArMessage);
            } else {
                toast.error(language === 'En' ? 'Error adding instructor-course relation' : 'خطأ في إضافة العلاقة بين المدرس والمادة');
            }
        }
    };

    const handleDelete = async (id) => {
        setAddingErrInstructorMessage('');
        setAddingErrCoursesMessage('');
        setAddingExistErr('');
        try {
            const response = await instructorsCoursesApi.deleteInstructorCourse(id);
            if (response.data.success) {
                fetchInstructorsCourses();
                toast.success(language === 'En' ? 'Deleting instructor-course relation successfully' : 'تم حذف العلاقة بين المدرس والمادة بنجاح');
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                toast.error(language === 'En' ? error.response.data.EnMessage : error.response.data.ArMessage);
            } else {
                toast.error(language === 'En' ? 'Error deleting instructor-course relation' : 'خطأ في حذف العلاقة بين المدرس والمادة');
            }
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

    const filteredData = instructorsCourses.filter((ic) =>
        (ic.first_name && ic.first_name.toLowerCase().includes(filter)) ||
        (ic.last_name && ic.last_name.toLowerCase().includes(filter)) ||
        (ic.department_name && ic.department_name.toLowerCase().includes(filter)) ||
        (ic.course_name && ic.course_name.toLowerCase().includes(filter))
    );

    return (
        <>
            <div>
                <SearchBar
                    filter={filter}
                    setFilter={setFilter}
                    searchText={language === "En"
                        ? "Search by doctor first/last name, department name or course name"
                        : "البحث حسب الاسم الأول/الأخير للمدرس، أو اسم القسم أو اسم المادة"}
                />
            </div>
            <table className="InstructorsView_course-table">
                <thead>
                <tr>
                    <th>{language === 'En' ? 'Doctor Name' : 'اسم الدكتور'}</th>
                    <th>{language === 'En' ? 'Department_Course' : 'القسم_المادة'}</th>
                    <th>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{addingErrInstructorMessage && (
                        <p style={{
                            color: 'red',
                            marginBottom: '8px',
                            fontStyle: 'italic'
                        }}>{addingErrInstructorMessage}</p>
                    )}
                        <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)}>
                            <option value="">{language === 'En' ? 'Select Doctor' : 'اختر الدكتور'}</option>
                            {instructors.map((instructor, index) => (
                                <option key={index}
                                        value={instructor.id}>{instructor.first_name} {instructor.last_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>{addingErrCoursesMessage && (
                        <p style={{
                            color: 'red',
                            marginBottom: '8px',
                            fontStyle: 'italic'
                        }}>{addingErrCoursesMessage}</p>
                    )}
                        <select multiple value={newDepartmentCourse}
                                onChange={(e) => setNewDepartmentCourse(
                                    [...e.target.options].filter(option => option.selected).map(option => option.value))}
                        >
                            {departmentsCourses
                                .filter(
                                    (dc) =>
                                        !instructorsCourses.some(
                                            (ic) => ic.department_course_id === dc.id
                                        )
                                )
                                .map((dc, index) => (
                                    <option key={index} value={dc.id}>
                                        {dc.department_name}_{dc.course_name}
                                    </option>
                                ))}
                        </select>
                    </td>
                    <td>{addingExistErr && (
                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingExistErr}</p>
                    )}
                        <button id={'AdminCourses_add-button'} onClick={handleAdd}>
                            {language === 'En' ? 'Add' : 'اضافة'}
                        </button>
                    </td>
                </tr>
                {filteredData && filteredData.map((ic, index) => (
                    <tr key={index}>
                        <td>
                            {ic.first_name} {ic.last_name}
                        </td>
                        <td>
                            {ic.department_name + "_" + ic.course_name}
                        </td>
                        <td>
                            <button id={'AdminCourses_delete-button'}
                                onClick={() => confirmDelete(ic.instructor_course_id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
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
