import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from "axios";

const Profile = ({ isDarkMode, language, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [phone, setPhone] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/100');
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:4001/user/${userId}`);
      setUserData(response.data);
      console.log(response.data);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // const handlePhoneChange = (e) => {
  //   setPhone(e.target.value);
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('password', password);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.put('http://localhost:4001/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedData = response.data;
      setUserData(updatedData);
      if (updatedData.img) {
        setImage(URL.createObjectURL(new Blob([updatedData.img], { type: 'image/*' })));
      }
      setIsEditing(false); // Exit edit mode after saving
      setPassword('');
      setConfirmPassword('');
      alert("Editing Success");
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
      <div className={`profile ${isDarkMode ? 'dark-mode' : 'light-mode'} ${language.toLowerCase()}`}>
        <h1>{language === 'En' ? 'User Profile' : 'الملف الشخصي'}</h1>
        <div className="profile-info">
          <img src={image} alt="Profile" className="profile-img" />
          <div className="profile-details">
            <p><strong>{language === 'En' ? 'Name:' : 'الاسم:'}</strong> {userData.first_name + " " + userData.last_name}</p>
            <p><strong>{language === 'En' ? 'Email:' : 'البريد الإلكتروني:'}</strong> {userData.email}</p>
            <p><strong>{language === 'En' ? 'Role:' : 'الدور:'}</strong> {userData.role}</p>
            <p><strong>{language === 'En' ? 'Code:' : 'الرمز:'}</strong> {userData.id}</p>
            {/*<p><strong>{language === 'En' ? 'Phone:' : 'رقم الهاتف:'}</strong> {phone}</p>*/}
          </div>
        </div>
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn edit-btn">
              {language === 'En' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
            </button>
        ) : (
            <div className="profile-edit">
              <h2>{language === 'En' ? 'Edit Profile' : 'تعديل الملف الشخصي'}</h2>
              <div className="form-group">
                <label htmlFor="password">{language === 'En' ? 'Password' : 'كلمة المرور'}</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={language === 'En' ? 'Enter new password' : 'أدخل كلمة مرور جديدة'}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">{language === 'En' ? 'Confirm Password' : 'تأكيد كلمة المرور'}</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder={language === 'En' ? 'Enter new password again to confirm' : 'أدخل كلمة مرور جديدة'}
                />
              </div>
              {/*<div className="form-group">*/}
              {/*  <label htmlFor="phone">{language === 'En' ? 'Phone' : 'رقم الهاتف'}</label>*/}
              {/*  <input*/}
              {/*      type="tel"*/}
              {/*      id="phone"*/}
              {/*      value={phone}*/}
              {/*      onChange={handlePhoneChange}*/}
              {/*      placeholder={language === 'En' ? 'Enter phone number' : 'أدخل رقم الهاتف'}*/}
              {/*  />*/}
              {/*</div>*/}
              <div className="form-group">
                <label htmlFor="image">{language === 'En' ? 'Profile Image' : 'صورة الملف الشخصي'}</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {image && <img src={image} alt="Profile Preview" className="img-preview"/>}
              </div>
              <button onClick={handleSave} className="btn save-btn">
                {language === 'En' ? 'Save Changes' : 'حفظ التغييرات'}
              </button>
              <button onClick={() => setIsEditing(false)} className="btn cancel-btn">
                {language === 'En' ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
        )}
      </div>
  );
};

export default Profile;
