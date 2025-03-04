import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import axios from '../../api/axios';
import UserContext from "../../context/UserContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const Profile = () => {
  const { isDarkMode, language, userId } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userData, setUserData] = useState('');
  const navigate = useNavigate();
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      setUserData(response.data);
      console.log(response.data);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(language === 'En' ? "Passwords do not match" : "كلمات المرور غير متطابقة");
      return;
    }

    try {
      const response = await axios.put('/api/user/editPassword', {userId, oldPassword, newPassword});
      if (response.data.success) {
        await axios.post('/api/auth/signOut', {userId});
        navigate('/SignIn');
        window.location.reload();
      } else {
        toast.error(language === 'En' ? response.data.EnMessage : response.data.ArMessage);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(language === 'En' ? err.response.data.EnMessage : err.response.data.ArMessage);
      } else {
        toast.error(language === 'En' ? 'Failed' : 'فشل');
      }
    }
  };

  return (
      <div className={'profile_container'}>
        <div className={`profile profile_${isDarkMode ? 'dark-mode' : 'light-mode'} profile_${language.toLowerCase()}`}>
          <h1>{language === 'En' ? 'Profile' : 'الملف الشخصي'}</h1>
          {!isEditing ? (
              <>
                <div className="profile profile_info">
                  <div className="profile profile_details">
                    <div>
                      <p>
                        <strong>{language === 'En' ? 'Name:' : 'الاسم:'}</strong> {userData.first_name + " " + userData.last_name}
                      </p>
                      <p>
                        <strong>{language === 'En' ? 'Email:' : 'البريد الإلكتروني:'}</strong> {userData.email}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>{language === 'En' ? 'Role:' : 'الدور:'}</strong> {userData.role}
                      </p>
                      <p>
                        <strong>{language === 'En' ? 'Code:' : 'الرمز:'}</strong> {userData.id}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={'profile_editBtnContainer'}>
                  <button onClick={() => setIsEditing(true)} className="profile_btn profile_edit_btn">
                    {language === 'En' ? 'Change Password' : 'تغيير كلمة السر'}
                  </button>
                </div>
              </>
          ) : (
              <div className="profile profile_edit">
                <div className="profile_form_group">
                  <label htmlFor="oldPassword">{language === 'En' ? 'Old Password' : 'كلمة المرور القديمة'}</label>
                  <input
                      type="password"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder={language === 'En' ? 'Enter old password' : 'أدخل كلمة المرور القديمة'}
                      className="profile input_field"
                  />
                </div>
                <div className="profile_form_group">
                  <label htmlFor="newPassword">{language === 'En' ? 'New Password' : 'كلمة المرور الجديدة'}</label>
                  <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={language === 'En' ? 'Enter new password' : 'أدخل كلمة المرور الجديدة'}
                      className="profile input_field"
                  />
                </div>
                <div className="profile_form_group">
                  <label
                      htmlFor="confirmPassword">{language === 'En' ? 'Confirm Password' : 'تأكيد كلمة المرور'}</label>
                  <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder={language === 'En' ? 'Enter new password again to confirm' : 'أدخل كلمة المرور الجديدة'}
                      className="profile input_field"
                  />
                </div>
                <div className={'profile_buttons'}>
                  <button onClick={handleSave} className="profile_btn profile_save_btn">
                    {language === 'En' ? 'Save' : 'حفظ'}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="profile_btn profile_cancel_btn">
                    {language === 'En' ? 'Cancel' : 'إلغاء'}
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default Profile;
