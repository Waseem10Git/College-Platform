import {useContext, useEffect, useState} from 'react';
import './Accounts.css';
import UserContext from "../../context/UserContext";
import { toast } from 'react-toastify';
import accountsApi from "../../api/accountsApi";
import departmentsApi from "../../api/departmentsApi";
import usersApi from "../../api/usersApi";
import { IoMdDownload } from "react-icons/io";

const Accounts = () => {
  const { language, isDarkMode } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState('users');
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName:'',
    email: '',
    password: '',
    role: '',
    departmentID: 0,
    newFirstName: '',
    newLastName: '',
    newEmail: '',
    newPassword: '',
    newRole: '',
    newDepartmentID: 0,
    userID: 0,
  });

  const resetFormData = () => {
    setFormData({
      firstName: '',
      lastName:'',
      email: '',
      password: '',
      role: '',
      departmentID: 0,
      newFirstName: '',
      newLastName: '',
      newEmail: '',
      newPassword: '',
      newRole: '',
      newDepartmentID: 0,
      userID: 0,
    });
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentsApi.fetchDepartment()
      setDepartments(response.data);
    } catch (error) {
      toast.error(language === 'En' ? 'fetch departments failed' : 'فشل جلب الأقسام');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersApi.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error(language === 'En' ? 'fetch users failed' : 'فشل جلب المستخدمين');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, [users]);

  // Function to handle filtering
  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  // Filtered data based on search query
  const filteredData = users.filter((user) =>
      (user.id && user.id.toString().includes(filter)) ||
      (user.first_name && user.first_name.toLowerCase().includes(filter)) ||
      (user.last_name && user.last_name.toLowerCase().includes(filter)) ||
      (user.email && user.email.toLowerCase().includes(filter)) ||
      (user.role && user.role.toLowerCase().includes(filter)) ||
      (user.department_id && user.department_id.toString().includes(filter))
  );

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    resetFormData();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error(language === 'En' ? 'Please select a file first' : 'رجاءاً أختر ملف');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the file directly to the backend
      const response = await accountsApi.uploadAccounts(formData);
      if (response.data.Status === "Success") {
        toast.success(language === 'En' ? 'Accounts added successfully' : 'تمت إضافة الحسابات بنجاح');
        resetFormData();
      } else {
        toast.error(language === 'En' ? 'Failed to add accounts' : 'فشل في إضافة الحسابات');
      }
    } catch (error) {
      console.error(error);
      toast.error(language === 'En' ? 'Failed, Please use the right template' : 'فشل، يرجى استخدام القالب الصحيح');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === "userID" || name === "departmentID" || name === "newDepartmentID" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToUpdate = {};
    if (formData.newFirstName) dataToUpdate.newFirstName = formData.newFirstName;
    if (formData.newLastName) dataToUpdate.newLastName = formData.newLastName;
    if (formData.newEmail) dataToUpdate.newEmail = formData.newEmail;
    if (formData.newPassword) dataToUpdate.newPassword = formData.newPassword;
    if (formData.newRole) dataToUpdate.newRole = formData.newRole;
    if (formData.newDepartmentID) dataToUpdate.newDepartmentID = formData.newDepartmentID;
    dataToUpdate.userID = formData.userID;

    if (selectedOption === "update"){
      accountsApi.updateAccount(dataToUpdate)
          .then(res => {
            if (res.data.Status === "Success") {
              toast.success(language === 'En' ? 'Account updated successfully' : 'تم تحديث الحساب بنجاح');
              resetFormData();
            } else {
              toast.error(language === 'En' ? 'Account updated failed' : 'فشل تحديث الحساب');
            }
          })
          .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 404) {
              toast.error(language === 'En' ? 'User not exist' : 'المستخدم غير موجود');
            } else {
              console.error(err);
              toast.error(language === 'En' ? 'Failed' : 'فشل');
            }
          });
      console.log('Submitted data to update:', dataToUpdate);
    }else if (selectedOption === "add") {
      console.log("form data", formData);
          accountsApi.addAccount(formData)
          .then(res => {
            if (res.data.Status === "Success") {
              toast.success(language === 'En' ? 'Account added successfully' : 'تم تحديث الحساب بنجاح');
              resetFormData();
            } else {
              toast.error(language === 'En' ? 'Account added failed' : 'فشل في تحديث الحساب');
            }
          })
          .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 404) {
              toast.error(language === 'En' ? 'ID number used' : 'الرقم التعريفي مستخدم');
            } else {
              console.error(err);
              toast.error(language === 'En' ? 'Failed' : 'فشل');
            }
          });
      console.log('Submitted data:', formData);
    }else {
          accountsApi.deleteAccount(formData.userID)
          .then(res => {
            if (res.data.Status === "Success") {
              toast.success(language === 'En' ? 'Account deleted successfully' : 'تم حذف الحساب بنجاح');
              resetFormData();
            } else {
              toast.error(language === 'En' ? 'Account deleted failed' : 'فشل في حذف الحساب');
            }
          })
          .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 404) {
              toast.error(language === 'En' ? 'User not exist' : 'المستخدم غير موجود');
            } else {
              console.error(err);
              toast.error(language === 'En' ? 'Failed' : 'فشل');
            }
          });
      console.log('Submitted data:', formData);
    }
  };


  return (
      <div className={`accounts-container ${isDarkMode ? 'accounts-container_dark' : 'accounts-container_light'}`}>
        <div className="accounts_component_container">
          <div className="accounts_component_account-section">
            <h2>{language === 'En' ? 'Manage Accounts' : 'اداره الحسابات'}</h2>
            <ul>
              <li className={selectedOption === "users" ? "accounts_component_active" : undefined} onClick={() => {
                handleOptionClick('users');
              }}>
                {language === 'En' ? 'All Users' : 'كل الحسابات'}
              </li>
              <li className={selectedOption === "upload" ? "accounts_component_active" : undefined} onClick={() => {
                handleOptionClick('upload');
              }}>
                {language === 'En' ? 'Upload Accounts' : 'رفع الحسابات'}
              </li>
              <li className={selectedOption === "add" ? "accounts_component_active" : undefined} onClick={() => {
                handleOptionClick('add');
              }}>
                {language === 'En' ? 'Add Account' : 'إضافة حساب'}
              </li>
              <li className={selectedOption === "update" ? "accounts_component_active" : undefined} onClick={() => {
                handleOptionClick('update');
              }}>
                {language === 'En' ? 'Update Account' : 'تحديث حساب'}
              </li>
              <li className={selectedOption === "delete" ? "accounts_component_active" : undefined} onClick={() => {
                handleOptionClick('delete');
              }}>
                {language === 'En' ? 'Delete Account' : 'حذف حساب'}
              </li>
            </ul>
          </div>
          <main>
            {selectedOption && (
                <>
                  {selectedOption === 'users' && (
                      <>
                        <div className="accounts_component_form-group">
                          {/* Filter input */}
                          <input
                              type="text"
                              placeholder={language === 'En' ? 'Search...' : 'بحث...'}
                              value={filter}
                              onChange={handleFilterChange}
                              className="filter-input"
                          />

                          {/* Table */}
                          <table>
                            <thead>
                            <tr>
                              <th>{language === 'En' ? 'ID' : 'الرقم'}</th>
                              <th>{language === 'En' ? 'First Name' : 'الاسم الأول'}</th>
                              <th>{language === 'En' ? 'Last Name' : 'الاسم الأخير'}</th>
                              <th>{language === 'En' ? 'Email' : 'البريد الإلكتروني'}</th>
                              <th>{language === 'En' ? 'Role' : 'الدور'}</th>
                              <th>{language === 'En' ? 'Department' : 'القسم'}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((user) => {
                                  const department = departments.find(dep => dep.department_id === user.department_id);
                                  return (<tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{department ? department.department_name : 'No Department'}</td>
                                  </tr>);
                                })
                            ) : (
                                <tr>
                                  <td colSpan="7" className="no-data">{language === 'En' ? 'No data available' : 'لا توجد بيانات'}</td>
                                </tr>
                            )}
                            </tbody>
                          </table>
                        </div>
                      </>
                  )}
                  <form onSubmit={handleSubmit}>
                    {selectedOption === 'upload' && (
                        <div className={"accounts_component_form-group"}>
                          <a
                              href="/user_template.xlsx"
                              download
                              style={{
                                textDecoration: 'none',
                                color: 'white',
                                backgroundColor: '#007bff',
                                padding: '5px 10px',
                                marginBottom: '20px',
                                borderRadius: '5px'
                              }}
                          >
                            <IoMdDownload/> {language === 'En' ? 'Download Template' : 'تحميل القالب'}
                          </a>
                          <input
                              type="file"
                              accept=".xlsx"
                              onChange={handleFileChange}
                          />
                          <button type="button" onClick={handleFileUpload}>
                            {language === 'En' ? 'Upload' : 'رفع'}
                          </button>
                        </div>
                    )}
                    {selectedOption === 'add' && (
                        <>
                          <div className="accounts_component_form-group">
                            <label htmlFor={"userID"}>{language === 'En' ? 'ID:' : ':الرقم التعريفي'}</label>
                            <input type={"text"} id={"userID"} name={"userID"} required value={formData.userID}
                                   onChange={handleInputChange}/>
                          </div>
                          <div className="accounts_component_form-group">
                            <label htmlFor={"firstName"}>{language === 'En' ? 'First Name:' : 'الاسم الأول:'}</label>
                            <input type={"text"} id={"firstName"} name={"firstName"} required value={formData.firstName}
                                   onChange={handleInputChange}/>
                          </div>
                          <div className="accounts_component_form-group">
                            <label htmlFor={"lastName"}>{language === 'En' ? 'Last Name:' : 'الاسم الأخير:'}</label>
                          <input type={"text"} id={"lastName"} name={"lastName"} required value={formData.lastName}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label htmlFor={"email"}>{language === 'En' ? 'Email:' : 'البريد الإلكتروني:'}</label>
                          <input type={"text"} id={"email"} name={"email"} required value={formData.email}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label htmlFor={"password"}>{language === 'En' ? 'Password:' : 'كلمة المرور:'}</label>
                          <input type={"password"} id={"password"} name={"password"} required value={formData.password}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label htmlFor={"role"}>{language === 'En' ? 'Role:' : 'الدور:'}</label>
                          <select className={"accounts_component_form-select"} id={"role"} name={"role"} required value={formData.role}
                                  onChange={handleInputChange}>
                            <option value="">{language === 'En' ? 'Select Role' : 'حدد الدور'}</option>
                            {/*<option value="admin">{language === 'En' ? 'Admin' : 'مسؤل'}</option>*/}
                            <option value="instructor">{language === 'En' ? 'Instructor' : 'مدرس'}</option>
                            <option value="student">{language === 'En' ? 'Student' : 'طالب'}</option>
                          </select>
                        </div>
                        {formData.role === "student" ? (
                            <div className="accounts_component_form-group">
                              <label htmlFor={"departmentID"}>{language === 'En' ? 'Department:' : 'القسم:'}</label>
                              <select className={"accounts_component_form-select"} id={"departmentID"} name={"departmentID"} required
                                      value={formData.departmentID}
                                      onChange={handleInputChange}>
                                <option value="">{language === 'En' ? 'Select Department' : 'حدد القسم'}</option>
                                {departments ? departments.map((dep, index) => (
                                  <option key={index} value={dep.department_id}>{dep.department_name}</option>
                                )) : null}
                              </select>
                            </div>) : null}
                        <button type="submit">{language === 'En' ? 'Add' : 'إضافة'}</button>
                      </>
                  )}
                  {selectedOption === 'update' && (
                      <>
                        <div className="accounts_component_form-group">
                          <label
                              htmlFor="userID">{language === 'En' ? 'According user ID:' : 'تبقا لمعرف المستخدم:'}</label>
                          <input type="number" id="userID" name="userID" value={formData.userID}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label
                              htmlFor="newFirstName">{language === 'En' ? 'New First Name:' : 'الاسم الجديد:'}</label>
                          <input type="text" id="newFirstName" name="newFirstName" value={formData.newFirstName}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label htmlFor="newLastName">{language === 'En' ? 'New Last Name:' : 'الاسم الجديد:'}</label>
                          <input type="text" id="newLastName" name="newLastName" value={formData.newLastName}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label
                              htmlFor="newEmail">{language === 'En' ? 'New Email:' : 'البريد الإلكتروني الجديد:'}</label>
                          <input type="text" id="newEmail" name="newEmail" value={formData.newEmail}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label
                              htmlFor="newPassword">{language === 'En' ? 'New Password:' : 'كلمة المرور الجديدة:'}</label>
                          <input type="password" id="newPassword" name="newPassword" value={formData.newPassword}
                                 onChange={handleInputChange}/>
                        </div>
                        <div className="accounts_component_form-group">
                          <label htmlFor="newRole">{language === 'En' ? 'Change Role:' : 'تغيرر الدور:'}</label>
                          <select className={"accounts_component_form-select"} id="newRole" name="newRole" value={formData.newRole}
                                  onChange={handleInputChange}>
                            <option value="">{language === 'En' ? 'Select Role' : 'حدد الدور'}</option>
                            {/*<option value="admin">{language === 'En' ? 'Admin' : 'مسؤل'}</option>*/}
                            <option value="instructor">{language === 'En' ? 'Instructor' : 'مدرس'}</option>
                            <option value="student">{language === 'En' ? 'Student' : 'طالب'}</option>
                          </select>
                        </div>
                        {formData.newRole === "student" ? (
                            <div className="accounts_component_form-group">
                              <label htmlFor={"newDepartmentID"}>{language === 'En' ? 'Change Department:' : 'تغيير القسم:'}</label>
                              <select className={"accounts_component_form-select"} id={"newDepartmentID"} name={"newDepartmentID"}
                                      value={formData.newDepartmentID} onChange={handleInputChange} required>
                                <option value="">{language === 'En' ? 'Select Department' : 'حدد القسم'}</option>
                                {departments ? departments.map((dep, index) => (
                                    <option key={index} value={dep.department_id}>{dep.department_name}</option>
                                )) : null}
                              </select>
                            </div>) : null}
                        <button type="submit">{language === 'En' ? 'Update' : 'تحديث'}</button>
                      </>
                  )}
                  {selectedOption === 'delete' && (
                      <>
                        <div className="accounts_component_form-group">
                          <label
                              htmlFor="userID">{language === 'En' ? 'User ID:' : ' الرقم التعريفي الخاص بالمستخدم:'}</label>
                          <input type="number" id="userID" name="userID" value={formData.userID}
                                 onChange={handleInputChange}/>
                        </div>
                        <button type="submit">{language === 'En' ? 'Delete' : 'حذف'}</button>
                      </>)}
                  </form>
                </>)}
          </main>
        </div>
      </div>
  );
};

export default Accounts;
