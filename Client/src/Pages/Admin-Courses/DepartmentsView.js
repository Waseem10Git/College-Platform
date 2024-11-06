import {useState, useEffect, useContext} from 'react';
import UserContext from "../../context/UserContext";
import departmentsApi from "../../api/departmentsApi";
import { toast } from 'react-toastify';
import {ConfirmDelete} from "../../components";

const DepartmentsView = ({ departments, fetchDepartments }) => {
    const { language } = useContext(UserContext);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [updatedDepartmentName, setUpdatedDepartmentName] = useState('');
    const [addingErrorMessage, setAddingErrorMessage] = useState('');
    const [editingErrorMessage, setEditingErrorMessage] = useState('');
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);


    useEffect(() => {
        fetchDepartments();
    }, []);

    const addDepartment = async (name) => {
        const trimmedName = name.trim().toLowerCase();

        if (!trimmedName) {
            setAddingErrorMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
            return;
        }

        if (departments.some(dep => dep.department_name.toLowerCase() === trimmedName)) {
            setAddingErrorMessage(language === 'En' ? 'The department already exists' : 'القسم موجود بالفعل');
            return;
        }

        // Clear any existing error messages
        setAddingErrorMessage('');

        // Proceed with adding the department
        try {
            const res = await departmentsApi.addDepartment(name);
            if (res.data.success) {
                fetchDepartments();
                setNewDepartmentName('');
                toast.success(language === 'En' ? 'Department added successfully' : 'تمت إضافة القسم بنجاح');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(language === 'En' ? 'Failed to add department' : 'فشل في إضافة القسم');
            }
        }
    };

    const updateDepartment = (id, name) => {
        setEditingErrorMessage('');

        const trimmedName = name.trim().toLowerCase();

        if (!trimmedName) {
            setEditingErrorMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
            return;
        }

        if (departments.some(dep => dep.department_name.toLowerCase() === trimmedName)) {
            setEditingErrorMessage(language === 'En' ? 'The department already exists' : 'القسم موجود بالفعل');
            return;
        }

        departmentsApi.editDepartment(id, name)
            .then(res => {
                if (res.data.success) {
                    fetchDepartments();
                    setEditingDepartment(null);
                    setUpdatedDepartmentName('');
                    toast.success(language === 'En' ? 'Department edited successfully' : 'تم تعديل القسم بنجاح');
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(language === 'En' ? 'Failed to edit department' : 'فشل في تعديل القسم');
            });
    };

    const deleteDepartment = (id) => {
        departmentsApi.deleteDepartment(id)
            .then(res => {
                if (res.data.success) {
                    toast.success(language === 'En' ? 'Department deleted successfully' : 'تم حذف القسم بنجاح');
                    fetchDepartments();
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(language === 'En' ? 'Failed to delete department' : 'فشل في حذف القسم');
            });
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


    return(
        <>
            <table className={"DepartmentsView_course-table"}>
                <thead>
                <tr>
                    <th onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>{language === 'En' ? 'Department Name' : 'اسم القسم'}</th>
                    <th onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>{language === 'En' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        {addingErrorMessage && (
                            <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{addingErrorMessage}</p>
                        )}
                        <input
                            type="text"
                            required
                            placeholder={language === 'En' ? 'Department Name' : 'اسم القسم'}
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                        />
                    </td>
                    <td>
                        <button onClick={
                            () => {
                                addDepartment(newDepartmentName)
                                setEditingDepartment(null);
                                setEditingErrorMessage('');
                            }}>
                            {language === 'En' ? 'Add' : 'إضافة'}
                        </button>
                    </td>
                </tr>
                {departments && departments.map(department => (
                    <tr key={department.department_id}>
                        <td>
                            {editingDepartment === department.department_id ? (
                                <>
                                    {editingErrorMessage && (
                                        <p style={{
                                            color: 'red',
                                            marginBottom: '8px',
                                            fontStyle: 'italic'
                                        }}>{editingErrorMessage}</p>
                                    )}
                                    <input
                                        type="text"
                                        value={updatedDepartmentName}
                                        onChange={(e) => setUpdatedDepartmentName(e.target.value)}
                                    />
                                </>
                            ) : (
                                department.department_name
                            )}
                        </td>
                        <td>
                            {editingDepartment === department.department_id ? (
                                <>
                                    <button
                                        onClick={() => updateDepartment(department.department_id, updatedDepartmentName)}>
                                        {language === 'En' ? 'Update' : 'تحديث'}
                                    </button>
                                    <button onClick={() => {
                                        setEditingDepartment(null);
                                        setEditingErrorMessage('');
                                    }}>
                                        {language === 'En' ? 'Cancel' : 'إلغاء'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => {
                                        setEditingDepartment(department.department_id);
                                        setUpdatedDepartmentName(department.department_name);
                                        setAddingErrorMessage('');
                                    }}>
                                        {language === 'En' ? 'Edit' : 'تعديل'}
                                    </button>
                                    <button onClick={() => confirmDelete(department.department_id)}>
                                        {language === 'En' ? 'Delete' : 'حذف'}
                                    </button>
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
                    handleDelete={() => deleteDepartment(departmentToDelete)}
                />
            )}
        </>
    );
}
export default DepartmentsView;