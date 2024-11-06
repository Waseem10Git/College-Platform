import React, {useContext, useEffect, useState} from "react";
import UserContext from "../../context/UserContext";
import departmentsCoursesApi from "../../api/departmentsCoursesApi";
import coursesApi from "../../api/coursesApi";
import { toast } from 'react-toastify';
import {ConfirmDelete} from "../../components";

const DepartmentsCoursesView = ({ departments }) => {
    const { language } = useContext(UserContext);
    const [courses, setCourses] = useState([]);
    const [departmentsCourses, setDepartmentsCourses] = useState([]);
    const [levels] = useState([1, 2, 3, 4]);
    const [semesters] = useState([1, 2]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const [newLevel, setNewLevel] = useState('');
    const [newSemester, setNewSemester] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [addingErrCourseMessage, setAddingErrCourseMessage] = useState('');
    const [addingErrDepartmentMessage, setAddingErrDepartmentMessage] = useState('');
    const [addingErrLevelMessage, setAddingErrLevelMessage] = useState('');
    const [addingErrSemesterMessage, setAddingErrSemesterMessage] = useState('');
    const [addingErrNewCourseDepartmentMessage, setAddingErrNewCourseDepartmentMessage] = useState('');
    const [editingErrCourseMessage, setEditingErrCourseMessage] = useState('');
    const [editingErrDepartmentMessage, setEditingErrDepartmentMessage] = useState('');
    const [editingErrLevelMessage, setEditingErrLevelMessage] = useState('');
    const [editingErrSemesterMessage, setEditingErrSemesterMessage] = useState('');
    const [editingErrNewCourseDepartmentMessage, setEditingErrNewCourseDepartmentMessage] = useState('');
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);

    const fetchDepartmentsCourses = async () => {
        try {
            const response = await departmentsCoursesApi.fetchDepartmentsCourses();
            setDepartmentsCourses(response.data);
        } catch (err) {
            console.log('Error fetching departments-courses data: ', err);
        }
    };

    useEffect(() => {
        coursesApi.fetchCourses().then(response => {
            setCourses(response.data);
        });
        fetchDepartmentsCourses();
    }, []);

    const validateAddingSelection = (department, course, level, semester) => {
        if (!course) {
            setAddingErrCourseMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (!department) {
            setAddingErrDepartmentMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (!level) {
            setAddingErrLevelMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (!semester) {
            setAddingErrSemesterMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }

        const isDuplicate = departmentsCourses.some(
            dc => dc.department_id.toString() === department && dc.course_code === course
        );
        if (isDuplicate) {
            setAddingErrNewCourseDepartmentMessage(language === 'En' ? 'This course-department combination already exists.' : 'هذا الجمع بين الدورة والقسم موجود بالفعل.');
            return false;
        }

        setAddingErrCourseMessage('');
        setAddingErrDepartmentMessage('');
        setAddingErrLevelMessage('');
        setAddingErrSemesterMessage('');
        return true;
    };

    const validateUpdatingSelection = (department, course, level, semester) => {
        if (!course) {
            setEditingErrCourseMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (!department) {
            setEditingErrDepartmentMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (!level) {
            setEditingErrLevelMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }
        if (!semester) {
            setEditingErrSemesterMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
            return false;
        }

        const isDuplicate = departmentsCourses.some(
            dc => dc.department_id.toString() === department && dc.course_code === course && dc.id !== editingCourse
        );
        if (isDuplicate) {
            setEditingErrNewCourseDepartmentMessage(language === 'En' ? 'This course-department combination already exists.' : 'هذا الجمع بين الدورة والقسم موجود بالفعل.');
            return false;
        }

        setAddingErrCourseMessage('');
        setAddingErrDepartmentMessage('');
        setAddingErrLevelMessage('');
        setAddingErrSemesterMessage('');
        return true;
    };

    const handleAdd = async () => {
        setEditingErrCourseMessage('');
        setEditingErrDepartmentMessage('');
        setEditingErrLevelMessage('');
        setEditingErrSemesterMessage('');
        setEditingErrNewCourseDepartmentMessage('');
        setAddingErrCourseMessage('');
        setAddingErrDepartmentMessage('');
        setAddingErrLevelMessage('');
        setAddingErrSemesterMessage('');
        setAddingErrNewCourseDepartmentMessage('');
        if (!validateAddingSelection(newDepartment, newCourse, newLevel, newSemester)) return;

        try {
            const res = await departmentsCoursesApi.addDepartmentCourse(newDepartment, newCourse, newLevel, newSemester);
            if (res.data.success) {
                toast.success(language === 'En' ? 'Department-course combination success!' : 'نجاح الجمع بين القسم والمقرر الدراسي!');
                fetchDepartmentsCourses();
                resetForm();
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Department-course combination failed' : 'فشل الجمع بين القسم والمقرر الدراسي');
            }
        }

    };

    const handleUpdate = (course) => {
        setEditingCourse(course.id);
        setSelectedCourse(course.course_code);
        setSelectedDepartment(course.department_id);
        setSelectedLevel(course.level);
        setSelectedSemester(course.semester);
    };

    const handleSaveUpdate = async () => {
        if (!validateUpdatingSelection(selectedDepartment, selectedCourse, selectedLevel, selectedSemester)) return;

        try {
            const res = await departmentsCoursesApi.updateDepartmentCourse(editingCourse, selectedDepartment, selectedCourse, selectedLevel, selectedSemester);
            if (res.data.success) {
                toast.success(language === 'En' ? 'Success updating department-course relation' : 'تم تحديث العلاقة بين القسم والمقرر الدراسي بنجاح');
                fetchDepartmentsCourses();
                resetForm();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Error updating department-course relation' : 'خطأ في تحديث العلاقة بين القسم والمقرر الدراسي');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await departmentsCoursesApi.deleteDepartmentCourse(id);
            if (res.data.success) {
                toast.success(language === 'En' ? 'Success deleting department-course relation' : 'تم حذف العلاقة بين القسم والمقرر الدراسي بنجاح');
                fetchDepartmentsCourses();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Error deleting department-course relation' : 'خطأ في حذف العلاقة بين القسم والمقرر الدراسي');
            }
        }

    };

    const confirmDelete = (id) => {
        setDepartmentToDelete(id);
        setDeletionVisible(true);
    };

    const resetForm = () => {
        setEditingCourse(null);
        setSelectedCourse('');
        setSelectedDepartment('');
        setSelectedLevel('');
        setSelectedSemester('');
        setNewCourse('');
        setNewDepartment('');
        setNewLevel('');
        setNewSemester('');
        setAddingErrCourseMessage('');
        setAddingErrDepartmentMessage('');
        setAddingErrLevelMessage('');
        setAddingErrSemesterMessage('');
        setAddingErrNewCourseDepartmentMessage('');
        setEditingErrCourseMessage('');
        setEditingErrDepartmentMessage('');
        setEditingErrLevelMessage('');
        setEditingErrSemesterMessage('');
        setEditingErrNewCourseDepartmentMessage('');
    };

    return (
        <>
            <table className="DepartmentsCoursesView_course-table">
                <thead>
                <tr>
                    <th>{language === 'En' ? 'Course' : 'الدورة'}</th>
                    <th>{language === 'En' ? 'Department' : 'القسم'}</th>
                    <th>{language === 'En' ? 'Level' : 'المستوى'}</th>
                    <th>{language === 'En' ? 'Semester' : 'الفصل'}</th>
                    <th>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        {addingErrCourseMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrCourseMessage}</p>
                        )}
                        <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)}>
                            <option value="" disabled>{language === 'En' ? 'Select Course' : 'اختر الدورة'}</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course.course_code}>{course.course_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {addingErrDepartmentMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrDepartmentMessage}</p>
                        )}
                        <select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)}>
                            <option value="" disabled>{language === 'En' ? 'Select Department' : 'اختر القسم'}</option>
                            {departments.map((department, index) => (
                                <option key={index}
                                        value={department.department_id}>{department.department_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {addingErrLevelMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrLevelMessage}</p>
                        )}
                        <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                            <option value="" disabled>{language === 'En' ? 'Select Level' : 'اختر المستوى'}</option>
                            {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {addingErrSemesterMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrSemesterMessage}</p>
                        )}
                        <select value={newSemester} onChange={(e) => setNewSemester(e.target.value)}>
                            <option value="" disabled>{language === 'En' ? 'Select Semester' : 'اختر الفصل'}</option>
                            {semesters.map(semester => (
                                <option key={semester} value={semester}>{semester}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {addingErrNewCourseDepartmentMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingErrNewCourseDepartmentMessage}</p>
                        )}
                        <button onClick={handleAdd}>
                            {language === 'En' ? 'Add' : 'اضافة'}
                        </button>
                    </td>
                </tr>
                {departmentsCourses.map(dc => (
                    <tr key={dc.id}>
                        <td>
                            {editingErrCourseMessage && (
                                <p style={{
                                    color: 'red',
                                    marginBottom: '8px',
                                    fontStyle: 'italic'
                                }}>{editingErrCourseMessage}</p>
                            )}
                            {editingCourse === dc.id ? (
                                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                    <option value=""
                                            disabled>{language === 'En' ? 'Select Course' : 'اختر الدورة'}</option>
                                    {courses.map((course, index) => (
                                        <option key={index} value={course.course_code}>{course.course_name}</option>
                                    ))}
                                </select>
                            ) : (
                                dc.course_name
                            )}
                        </td>
                        <td>
                            {editingErrDepartmentMessage && (
                                <p style={{
                                    color: 'red',
                                    marginBottom: '8px',
                                    fontStyle: 'italic'
                                }}>{editingErrDepartmentMessage}</p>
                            )}
                            {editingCourse === dc.id ? (
                                <select value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}>
                                    <option value=""
                                            disabled>{language === 'En' ? 'Select Department' : 'اختر القسم'}</option>
                                    {departments.map((department, index) => (
                                        <option key={index}
                                                value={department.department_id}>{department.department_name}</option>
                                    ))}
                                </select>
                            ) : (
                                dc.department_name
                            )}
                        </td>
                        <td>
                            {editingErrLevelMessage && (
                                <p style={{
                                    color: 'red',
                                    marginBottom: '8px',
                                    fontStyle: 'italic'
                                }}>{editingErrLevelMessage}</p>
                            )}
                            {editingCourse === dc.id ? (
                                <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                                    <option value=""
                                            disabled>{language === 'En' ? 'Select Level' : 'اختر المستوى'}</option>
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            ) : (
                                dc.level
                            )}
                        </td>
                        <td>
                            {editingErrSemesterMessage && (
                                <p style={{
                                    color: 'red',
                                    marginBottom: '8px',
                                    fontStyle: 'italic'
                                }}>{editingErrSemesterMessage}</p>
                            )}
                            {editingCourse === dc.id ? (
                                <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                                    <option value=""
                                            disabled>{language === 'En' ? 'Select Semester' : 'اختر الفصل'}</option>
                                    {semesters.map(semester => (
                                        <option key={semester} value={semester}>{semester}</option>
                                    ))}
                                </select>
                            ) : (
                                dc.semester
                            )}
                        </td>
                        <td>
                            {editingCourse === dc.id ? (
                                <>
                                    {editingErrNewCourseDepartmentMessage && (
                                        <p style={{
                                            color: 'red',
                                            marginBottom: '8px',
                                            fontStyle: 'italic'
                                        }}>{editingErrNewCourseDepartmentMessage}</p>
                                    )}
                                    <button onClick={handleSaveUpdate}>{language === 'En' ? 'Update' : 'تحديث'}</button>
                                    <button onClick={resetForm}>{language === 'En' ? 'Cancel' : 'إلغاء'}</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => {
                                        handleUpdate(dc)
                                        setAddingErrCourseMessage('');
                                        setAddingErrDepartmentMessage('');
                                        setAddingErrLevelMessage('');
                                        setAddingErrSemesterMessage('');
                                        setAddingErrNewCourseDepartmentMessage('');
                                    }}>
                                        {language === 'En' ? 'Edit' : 'تعديل'}
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(dc.id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                                </>
                            )}
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
}

export default DepartmentsCoursesView;
