import { useState, useEffect } from 'react';
import axios from "axios";

const DepartmentsView = ({ language }) => {
    const [departments, setDepartments] = useState([]);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [updatedDepartmentName, setUpdatedDepartmentName] = useState('');

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/departments');
            setDepartments(response.data);
        }catch (err) {
            console.log("Error fetching departments data: ", err);
        }
    }
    useEffect(() => {
        fetchDepartments();
    }, []);
    // console.log("departments: ", departments)
    const addDepartment = (name) => {
        if (name && !departments.some(dep => dep.department_name === name)) {
            console.log("name: ", name)
            axios.post('http://localhost:4001/api/departments', { department_name: name })
                .then(res => {
                    if (res.data.success) {
                        // setDepartments([...departments, { department_name: name }]);
                        fetchDepartments();
                        setNewDepartmentName('');
                    }
                })
                .catch(err => console.error(err));
        }
    };

    const updateDepartment = (id, name) => {
        axios.put(`http://localhost:4001/api/departments/${id}`, { department_name: name })
            .then(res => {
                if (res.data.success) {
                    // setDepartments(departments.map(dep => dep.id === id ? { ...dep, department_name: name } : dep));
                    fetchDepartments();
                    setEditingDepartment(null);
                    setUpdatedDepartmentName('');
                }
            })
            .catch(err => console.error(err));
    };

    const deleteDepartment = (id) => {
        axios.delete(`http://localhost:4001/api/departments/${id}`)
            .then(res => {
                if (res.data.success) {
                    // setDepartments(departments.filter(dep => dep.id !== id));
                    fetchDepartments();
                }
            })
            .catch(err => console.error(err));
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
        <table className="course-table">
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
                    <input
                        type="text"
                        placeholder="Add Department"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                </td>
                <td>
                    <button onClick={() => addDepartment(newDepartmentName)}>Add</button>
                </td>
            </tr>
            {departments.map(department => (
                <tr key={department.department_id}>
                    <td>
                        {editingDepartment === department.department_id ? (
                            <input
                                type="text"
                                value={updatedDepartmentName}
                                onChange={(e) => setUpdatedDepartmentName(e.target.value)}
                            />
                        ) : (
                            department.department_name
                        )}
                    </td>
                    <td>
                        {editingDepartment === department.department_id ? (
                            <>
                                <button
                                    onClick={() => updateDepartment(department.department_id, updatedDepartmentName)}>Update
                                </button>
                                <button onClick={() => setEditingDepartment(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => {
                                    setEditingDepartment(department.department_id);
                                    setUpdatedDepartmentName(department.department_name);
                                }}>Edit
                                </button>
                                <button onClick={() => deleteDepartment(department.department_id)}>Delete</button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
export default DepartmentsView;