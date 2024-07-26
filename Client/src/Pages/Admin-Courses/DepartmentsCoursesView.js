import React, { useEffect, useState } from "react";
import axios from "axios";

const DepartmentsCoursesView = ({ language, departments }) => {
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

    const fetchDepartmentsCourses = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/departments-courses');
            setDepartmentsCourses(response.data);
        } catch (err) {
            console.log('Error fetching departments-courses data: ', err);
        }
    };

    useEffect(() => {
        axios.get('http://localhost:4001/api/courses').then(response => {
            setCourses(response.data);
        });
        fetchDepartmentsCourses();
    }, []);
    console.log("courses: ", courses);
    console.log("Departments: ", departments);
    console.log("Departments Courses: ", departmentsCourses);

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:4001/api/departments-courses', {
                department_id: newDepartment,
                course_id: newCourse,
                level: newLevel,
                semester: newSemester
            }).then(res => {
                if (res.data.success) {
                    fetchDepartmentsCourses();
                    resetForm();
                }
            }).catch(err => console.error(err));
        } catch (error) {
            console.error('Error adding department-course relation:', error);
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
        try {
            await axios.put(`http://localhost:4001/api/departments-courses/${editingCourse}`, {
                department_id: selectedDepartment || undefined,
                course_id: selectedCourse || undefined,
                level: selectedLevel || undefined,
                semester: selectedSemester || undefined
            }).then(res => {
                if (res.data.success) {
                    fetchDepartmentsCourses();
                    resetForm();
                }
            }).catch(err => console.error(err));
        } catch (error) {
            console.error('Error updating department-course relation:', error);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:4001/api/departments-courses/${id}`)
            .then(res => {
                if (res.data.success) {
                    fetchDepartmentsCourses();
                }
            })
            .catch(err => console.error(err));
    };

    const resetForm = () => {
        setEditingCourse(null);
        setSelectedCourse('');
        setSelectedDepartment('');
        setSelectedLevel('');
        setSelectedSemester('');
    };

    return (
        <table className="course-table">
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
                    <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)}>
                        <option value="">{language === 'En' ? 'Select Course' : 'اختر الدورة'}</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course.course_code}>{course.course_name}</option>
                        ))}
                    </select>
                </td>
                <td>
                    <select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)}>
                        <option value="">{language === 'En' ? 'Select Department' : 'اختر القسم'}</option>
                        {departments.map((department, index) => (
                            <option key={index} value={department.department_id}>{department.department_name}</option>
                        ))}
                    </select>
                </td>
                <td>
                    <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                        <option value="">{language === 'En' ? 'Select Level' : 'اختر المستوى'}</option>
                        {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </td>
                <td>
                    <select value={newSemester} onChange={(e) => setNewSemester(e.target.value)}>
                        <option value="">{language === 'En' ? 'Select Semester' : 'اختر الفصل'}</option>
                        {semesters.map(semester => (
                            <option key={semester} value={semester}>{semester}</option>
                        ))}
                    </select>
                </td>
                <td>
                    <button onClick={handleAdd}>
                        {language === 'En' ? 'Add' : 'اضافة'}
                    </button>
                </td>
            </tr>
            {departmentsCourses.map(dc => (
                <tr key={dc.id}>
                    <td>
                        {editingCourse === dc.id ? (
                            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                <option value="">{language === 'En' ? 'Select Course' : 'اختر الدورة'}</option>
                                {courses.map((course, index) => (
                                    <option key={index} value={course.course_code}>{course.course_name}</option>
                                ))}
                            </select>
                        ) : (
                            dc.course_name
                        )}
                    </td>
                    <td>
                        {editingCourse === dc.id ? (
                            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                                <option value="">{language === 'En' ? 'Select Department' : 'اختر القسم'}</option>
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
                        {editingCourse === dc.id ? (
                            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                                <option value="">{language === 'En' ? 'Select Level' : 'اختر المستوى'}</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        ) : (
                            dc.level
                        )}
                    </td>
                    <td>
                        {editingCourse === dc.id ? (
                            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                                <option value="">{language === 'En' ? 'Select Semester' : 'اختر الفصل'}</option>
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
                                <button onClick={handleSaveUpdate}>{language === 'En' ? 'Update' : 'تحديث'}</button>
                                <button onClick={resetForm}>{language === 'En' ? 'Cancel' : 'إلغاء'}</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleUpdate(dc)}>{language === 'En' ? 'Edit' : 'تعديل'}</button>
                                <button onClick={() => handleDelete(dc.id)}>{language === 'En' ? 'Delete' : 'حذف'}</button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DepartmentsCoursesView;
