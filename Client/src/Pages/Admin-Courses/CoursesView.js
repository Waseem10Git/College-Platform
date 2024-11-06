import React, {useState, useEffect, useContext} from 'react';
import UserContext from "../../context/UserContext";
import coursesApi from "../../api/coursesApi";
import { toast } from 'react-toastify';
import {ConfirmDelete} from "../../components";

const CoursesView = () => {
    const { isDarkMode, language } = useContext(UserContext);
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        course_code: '', course_name: ''
    });
    const [editingCourse, setEditingCourse] = useState(null);
    const [updatedCourse, setUpdatedCourse] = useState({
        course_code: '', course_name: ''
    });
    const [addingIDErrorMessage, setIDAddingErrorMessage] = useState('');
    const [addingNameErrorMessage, setNameAddingErrorMessage] = useState('');
    const [addingIDExistErrorMessage, setIDExistErrorMessage] = useState('');
    const [addingNameExistErrorMessage, setNameExistErrorMessage] = useState('');
    const [editingNameErrorMessage, setNameEditingErrorMessage] = useState('');
    const [editingIDErrorMessage, setIDEditingErrorMessage] = useState('');
    const [editingNameExistErrorMessage, setNameEditingExistErrorMessage] = useState('');
    const [editingIDExistErrorMessage, setIDEditingExistErrorMessage] = useState('');
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);

    const fetchCourses = async () => {
        try {
            const response = await coursesApi.fetchCourses();
            setCourses(response.data);
        } catch (err) {
            console.log('Error fetching courses data: ', err);
        }
    };


    useEffect(() => {
        fetchCourses();
    }, []);

    const isAddingCourseDataValid = (course, courses) => {
        if (!course.course_code) {
            setIDAddingErrorMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
            return false;
        }

        const courseIDExists = courses.some((existingCourse) => existingCourse.course_code === course.course_code);
        if (courseIDExists) {
            setIDExistErrorMessage(language === 'En' ? 'The course ID already exists' : 'المادة موجود بالفعل');
            return false;
        }

        if (!course.course_name) {
            setNameAddingErrorMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
            return false;
        }

        const courseNameExists = courses.some((existingCourse) => existingCourse.course_name === course.course_name);
        if (courseNameExists) {
            setNameExistErrorMessage(language === 'En' ? 'The course name already exists' : 'المادة موجود بالفعل');
            return false;
        }
        return true;
    };

    const isEditingCourseDataValid = (course, courses) => {
        if (!course.course_code) {
            setIDEditingErrorMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
            return false;
        }

        const courseCodeExists = courses.some((existingCourse) =>
            existingCourse.course_code === course.course_code && existingCourse.course_code !== editingCourse
        );
        if (courseCodeExists) {
            setIDEditingExistErrorMessage(language === 'En' ? 'The course ID already exists' : 'رقم الدورة موجود بالفعل');
            return;
        }

        if (!course.course_name) {
            setNameEditingErrorMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
            return false;
        }

        const courseNameExists = courses.some((existingCourse) =>
            existingCourse.course_name === course.course_name && existingCourse.course_code !== editingCourse
        );
        if (courseNameExists) {
            setNameEditingExistErrorMessage(language === 'En' ? 'The course name already exists' : 'اسم الدورة موجود بالفعل');
            return;
        }
        return true;
    };

    const addCourse = async (course) => {
        setIDAddingErrorMessage('');
        setNameAddingErrorMessage('');
        setIDExistErrorMessage('');
        setNameExistErrorMessage('');
        setEditingCourse(null);
        setNameEditingExistErrorMessage('');
        setIDEditingExistErrorMessage('');
        setNameEditingErrorMessage('');
        setIDEditingErrorMessage('');

        if (!isAddingCourseDataValid(course, courses)) return;

        try {
            await coursesApi.addCourse(course);
            toast.success(language === 'En' ? 'Course added successfully!' : 'تمت إضافة المادة بنجاح!');

            fetchCourses(); // Make sure fetchCourses doesn't trigger a toast
            setNewCourse({ course_code: '', course_name: '' });
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Error adding course.' : 'حدث خطأ أثناء إضافة المادة.');
            }
        }
    };


    const updateCourse = async (course) => {
        setIDEditingErrorMessage('');
        setNameEditingErrorMessage('');
        setIDEditingExistErrorMessage('');
        setNameExistErrorMessage('');

        if (!isEditingCourseDataValid(course, courses)) return;

        try {
            await coursesApi.editCourse(editingCourse, course);
            toast.success(language === 'En' ? 'Course updated successfully!' : 'تم تحديث المادة بنجاح!');
            setEditingCourse(null);
            setUpdatedCourse({ course_code: '', course_name: '' });
            fetchCourses();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Error updating course.' : 'حدث خطأ أثناء تحديث المادة.');
            }
        }
    };

    const deleteCourse = async (id) => {
        try {
            await coursesApi.deleteCourse(id);
            toast.success(language === 'En' ? 'Course deleted successfully!' : 'تم حذف المادة بنجاح!');
            fetchCourses();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Error deleting course.' : 'حدث خطأ أثناء حذف المادة.');
            }
        }
    };

    const confirmDelete = (id) => {
        setDepartmentToDelete(id);
        setDeletionVisible(true);
    };


    const [resizing, setResizing] = useState(false);
    const [start, setStart] = useState(null);
    const [startWidth, setStartWidth] = useState(null);

    const handleMouseDown = (e) => {
        setStart(e.clientX);
        setStartWidth(e.target.clientWidth);
        setResizing(true);
        document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
        if (resizing) {
            const newWidth = startWidth + (e.clientX - start);
            e.target.style.width = `${newWidth}px`;
        }
    };

    const handleMouseUp = () => {
        setResizing(false);
        document.body.style.userSelect = 'auto';
    };

    const handleMouseEnter = (e) => {
        e.target.style.cursor = 'col-resize';
    };

    const handleMouseLeave = (e) => {
        e.target.style.cursor = 'auto';
    };


    return (
        <>
            <table className="CoursesView_course-table">
                <thead>
                <tr>
                    <th onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>{language === 'En' ? 'Course ID' : 'رقم الدورة'}</th>
                    <th onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>{language === 'En' ? 'Course Name' : 'اسم الدورة'}</th>
                    <th onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{addingIDErrorMessage && (
                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingIDErrorMessage}</p>
                    )}
                        {addingIDExistErrorMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingIDExistErrorMessage}</p>
                        )}
                        <input
                            type="text"
                            placeholder="Course ID"
                            value={newCourse.course_code}
                            onChange={(e) => setNewCourse({...newCourse, course_code: e.target.value})}
                        />
                    </td>
                    <td>{addingNameErrorMessage && (
                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingNameErrorMessage}</p>
                    )}
                        {addingNameExistErrorMessage && (
                            <p style={{
                                color: 'red',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>{addingNameExistErrorMessage}</p>
                        )}
                        <input
                            type="text"
                            placeholder="Course Name"
                            value={newCourse.course_name}
                            onChange={(e) => setNewCourse({...newCourse, course_name: e.target.value})}
                        />
                    </td>
                    <td>
                        <button onClick={() => addCourse(newCourse)}>{language === 'En' ? 'Add' : 'إضافة'}</button>
                    </td>
                </tr>

                {courses.map((course, index) => (
                    <tr key={index}>
                        <td>
                            {editingCourse === course.course_code ? (
                                <>
                                    {editingIDErrorMessage && (
                                        <p style={{
                                            color: 'red',
                                            marginBottom: '8px',
                                            fontStyle: 'italic'
                                        }}>{editingIDErrorMessage}</p>
                                    )}
                                    {editingIDExistErrorMessage && (
                                        <p style={{
                                            color: 'red',
                                            marginBottom: '8px',
                                            fontStyle: 'italic'
                                        }}>{editingIDExistErrorMessage}</p>
                                    )}
                                    <input
                                        type="text"
                                        value={updatedCourse.course_code}
                                        onChange={(e) => setUpdatedCourse({
                                            ...updatedCourse,
                                            course_code: e.target.value
                                        })}
                                    />
                                </>
                            ) : (
                                course.course_code
                            )}
                        </td>
                        <td>
                            {editingCourse === course.course_code ? (
                                <>
                                    {editingNameErrorMessage && (
                                        <p style={{
                                            color: 'red',
                                            marginBottom: '8px',
                                            fontStyle: 'italic'
                                        }}>{editingNameErrorMessage}</p>
                                    )}
                                    {editingNameExistErrorMessage && (
                                        <p style={{
                                            color: 'red',
                                            marginBottom: '8px',
                                            fontStyle: 'italic'
                                        }}>{editingNameExistErrorMessage}</p>
                                    )}
                                    <input
                                        type="text"
                                        value={updatedCourse.course_name}
                                        onChange={(e) => setUpdatedCourse({
                                            ...updatedCourse,
                                            course_name: e.target.value
                                        })}
                                    />
                                </>
                            ) : (
                                course.course_name
                            )}
                        </td>
                        <td>
                            {editingCourse === course.course_code ? (
                                <>
                                    <button onClick={() => updateCourse(updatedCourse)}>Update</button>
                                    <button onClick={() => setEditingCourse(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => {
                                        setEditingCourse(course.course_code);
                                        setUpdatedCourse(course);
                                        setNameAddingErrorMessage('');
                                        setIDAddingErrorMessage('');
                                        setIDExistErrorMessage('');
                                        setNameExistErrorMessage('');
                                    }}>Edit
                                    </button>
                                    <button onClick={() => confirmDelete(course.course_code)}>Delete</button>
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
                    handleDelete={() => deleteCourse(departmentToDelete)}
                />
            )}
        </>
    );
};

export default CoursesView;
