//there is many updates in this page
import React, { useState } from 'react';
import './Accounts.css';
import axios from "axios";

const Accounts = ({ language, isDarkMode,relative,fixed }) => {
  const [selectedOption, setSelectedOption] = useState('add');
  const [departmentName, setDepartmentName] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    middleName:'',
    lastName:'',
    email: '',
    password: '',
    role: '',
    departmentID: 0,
    newFirstName: '',
    newMiddleName: '',
    newLastName: '',
    newEmail: '',
    newPassword: '',
    userID: 0,
  });

  const resetFormData = () => {
    setFormData({
      firstName: '',
      middleName:'',
      lastName:'',
      email: '',
      password: '',
      role: '',
      departmentID: 0,
      newFirstName: '',
      newMiddleName: '',
      newLastName: '',
      newEmail: '',
      newPassword: '',
      userID: 0,
    });
    setDepartmentName("");
  };
  const handleOptionClick = (option) => {
    
    setSelectedOption(option);
    resetFormData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToUpdate = {};
    if (formData.newFirstName) dataToUpdate.newFirstName = formData.newFirstName;
    if (formData.newMiddleName) dataToUpdate.newMiddleName = formData.newMiddleName;
    if (formData.newLastName) dataToUpdate.newLastName = formData.newLastName;
    if (formData.newEmail) dataToUpdate.newEmail = formData.newEmail;
    if (formData.newPassword) dataToUpdate.newPassword = formData.newPassword;
    dataToUpdate.userID = formData.userID;
    let response;
    if (selectedOption === "update"){
      axios.post(`http://localhost:4001/update-account`, dataToUpdate)
          .then(res => {
            if (res.data.Status === "Success") {
              alert("Success");
              resetFormData();
            } else {
              alert("Failed");
            }
          })
          .catch(err => {
            console.error(err);
            alert("Failed");
          });
      console.log('Submitted data to update:', dataToUpdate);
    }else {
      axios.post(`http://localhost:4001/${selectedOption}-account`, { ...formData, departmentName })
          .then(res => {
            if (res.data.Status === "Success") {
              alert("Success");
              resetFormData();
            } else {
              alert("Failed");
            }
          })
          .catch(err => {
            console.error(err);
            alert("Failed");
          });
      console.log('Submitted data:', formData, departmentName);
    }
  };


  return (
    <div className={`accounts-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='container'>
        <div className="account-section">
          <h2>{language === 'En' ? 'Manage Accounts' : 'اداره الحسابات'}</h2>
          <ul>
            <li  className={selectedOption === "add" && "active"} onClick={() => {handleOptionClick('add') ; relative();} }  >
              {language === 'En' ? 'Add Account' : 'إضافة حساب'}
            </li>
            <li className={selectedOption === "update" && "active"} onClick={() => {handleOptionClick('update') ; relative()}} >
              {language === 'En' ? 'Update Account' : 'تحديث حساب'}
            </li>
            <li className={selectedOption === "delete" && "active"} onClick={() => {handleOptionClick('delete') ; fixed();}} >
              {language === 'En' ? 'Delete Account' : 'حذف حساب'}
            </li>
          </ul>
        </div>
      <main>
      {selectedOption && (
       
          <form onSubmit={handleSubmit}>
            {selectedOption === 'add' && (
                <>
                  <div className="form-group">
                    <label htmlFor="first-name">{language === 'En' ? 'First Name:' : 'الاسم الأول:'}</label>
                    <input type="text" id="first-name" name="first-name" required value={formData.firstName}
                           onChange={event => setFormData({...formData, firstName: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="middle-name">{language === 'En' ? 'Middle Name:' : 'الاسم الأوسط:'}</label>
                    <input type="text" id="middle-name" name="middle-name" required value={formData.middleName}
                           onChange={event => setFormData({...formData, middleName: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name">{language === 'En' ? 'Last Name:' : 'الاسم الأخير:'}</label>
                    <input type="text" id="last-name" name="last-name" required value={formData.lastName}
                           onChange={event => setFormData({...formData, lastName: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{language === 'En' ? 'Email:' : 'البريد الإلكتروني:'}</label>
                    <input type="text" id="email" name="email" required value={formData.email}
                           onChange={event => setFormData({...formData, email: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">{language === 'En' ? 'Password:' : 'كلمة المرور:'}</label>
                    <input type="password" id="password" name="password" required value={formData.password}
                           onChange={event => setFormData({...formData, password: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">{language === 'En' ? 'Role:' : 'الدور:'}</label>
                    <select id="role" name="role" required value={formData.role}
                            onChange={event => setFormData({...formData, role: event.target.value})}>
                      <option value="">{language === 'En' ? 'Select Role' : 'حدد الدور'}</option>
                      {/*<option value="admin">{language === 'En' ? 'Admin' : 'مسؤل'}</option>*/}
                      <option value="instructor">{language === 'En' ? 'Instructor' : 'مدرس'}</option>
                      <option value="student">{language === 'En' ? 'Student' : 'طالب'}</option>
                    </select>
                  </div>
                  {formData.role==="student" ? (<div className="form-group">
                    <label htmlFor="department">{language === 'En' ? 'Department:' : 'القسم:'}</label>
                    <select id={"department"} name={"department"} required value={departmentName}
                            onChange={event => setDepartmentName(event.target.value)}>
                      <option value="">{language === 'En' ? 'Select Department' : 'حدد القسم'}</option>
                      <option value="IS">{language === 'En' ? 'IS' : 'نظم المعلومات'}</option>
                      <option value="CS">{language === 'En' ? 'CS' : 'علوم الحاسوب'}</option>
                      <option value="AI">{language === 'En' ? 'AI' : 'الذكاء اصطناعي'}</option>
                      <option value="BI">{language === 'En' ? 'BI' : 'العلوم الحيوية'}</option>
                    </select>
                  </div>) : (<div className="form-group">
                    <label htmlFor="department">{language === 'En' ? 'Department:' : 'القسم:'}</label>
                    <select id={"department"} name={"department"} required value={departmentName}
                            onChange={event => setDepartmentName(event.target.value)}>
                      <option value="">{language === 'En' ? 'Select Department' : 'حدد القسم'}</option>
                      <option value="Not In Department">{language === 'En' ? 'Not In Department' : 'ليس لديه قسم'}</option>
                    </select>
                  </div>)}
                  <button type="submit">{language === 'En' ? 'Add' : 'إضافة'}</button>
                </>
            )}
            {selectedOption === 'update' && (
                <>
                  <div className="form-group">
                    <label htmlFor="userID">{language === 'En' ? 'According user ID:' : 'تبقا لمعرف المستخدم:'}</label>
                    <input type="number" id="userID" name="userID" value={formData.userID}
                           onChange={event => setFormData({...formData, userID: parseInt(event.target.value)})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="newFirstName">{language === 'En' ? 'New First Name:' : 'الاسم الجديد:'}</label>
                    <input type="text" id="newFirstName" name="newFirstName" value={formData.newFirstName}
                           onChange={event => setFormData({...formData, newFirstName: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="newMiddleName">{language === 'En' ? 'New Middle Name:' : 'الاسم الجديد:'}</label>
                    <input type="text" id="newMiddleName" name="newMiddleName" value={formData.newMiddleName}
                           onChange={event => setFormData({...formData, newMiddleName: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="newLastName">{language === 'En' ? 'New Last Name:' : 'الاسم الجديد:'}</label>
                    <input type="text" id="newLastName" name="newLastName" value={formData.newLastName}
                           onChange={event => setFormData({...formData, newLastName: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="newEmail">{language === 'En' ? 'New Email:' : 'البريد الإلكتروني الجديد:'}</label>
                    <input type="text" id="newEmail" name="newEmail" value={formData.newEmail}
                           onChange={event => setFormData({...formData, newEmail: event.target.value})}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">{language === 'En' ? 'New Password:' : 'كلمة المرور الجديدة:'}</label>
                    <input type="password" id="newPassword" name="newPassword" value={formData.newPassword}
                           onChange={event => setFormData({...formData, newPassword: event.target.value})}/>
                  </div>
                  <button type="submit">{language === 'En' ? 'Update' : 'تحديث'}</button>
                </>
            )}
            {selectedOption === 'delete' && (
                <>
                  <div className="form-group">
                    <label htmlFor="deleteUserID">{language === 'En' ? 'User ID:' : ' الرقم التعريفي الخاص بالمستخدم:'}</label>
                    <input type="number" id="deleteUserID" name="deleteUserID" value={formData.userID}
                           onChange={event => setFormData({...formData, userID: parseInt(event.target.value)})} />
                </div>
                <button type="submit">{language === 'En' ? 'Delete' : 'حذف'}</button>
              </>
            )}
          </form>
      )}
      </main>
      </div>
    </div>
  );
};

export default Accounts;
