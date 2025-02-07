import React, {useState, useEffect, useContext} from 'react';
import './Profile.css';
import axios from '../../api/axios';
import UserContext from "../../context/UserContext";

const Profile = () => {
  const { isDarkMode, language, userId } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/100');
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState('');

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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

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
      const response = await axios.put('/api/user/update', formData, {
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
      <div className={`profile profile_${isDarkMode ? 'dark-mode' : 'light-mode'} profile_${language.toLowerCase()}`}>
        <h1>{language === 'En' ? 'Profile' : 'الملف الشخصي'}</h1>
        <div className="profile profile_info">
          <div className="profile profile_details">
            <p>
              <strong>{language === 'En' ? 'Name:' : 'الاسم:'}</strong> {userData.first_name + " " + userData.last_name}
            </p>
            <p><strong>{language === 'En' ? 'Email:' : 'البريد الإلكتروني:'}</strong> {userData.email}</p>
            <p><strong>{language === 'En' ? 'Role:' : 'الدور:'}</strong> {userData.role}</p>
            <p><strong>{language === 'En' ? 'Code:' : 'الرمز:'}</strong> {userData.id}</p>
          </div>
        </div>
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="profile edit_btn">
              {language === 'En' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
            </button>
        ) : (
            <div className="profile profile_edit">
              <h2>{language === 'En' ? 'Edit Profile' : 'تعديل الملف الشخصي'}</h2>
              <div className="profile form_group">
                <label htmlFor="password">{language === 'En' ? 'Password' : 'كلمة المرور'}</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={language === 'En' ? 'Enter new password' : 'أدخل كلمة مرور جديدة'}
                    className="profile input_field"
                />
              </div>
              <div className="profile form_group">
                <label htmlFor="confirmPassword">{language === 'En' ? 'Confirm Password' : 'تأكيد كلمة المرور'}</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder={language === 'En' ? 'Enter new password again to confirm' : 'أدخل كلمة مرور جديدة'}
                    className="profile input_field"
                />
              </div>
              <div className="profile form_group">
                <label htmlFor="image">{language === 'En' ? 'Profile Image' : 'صورة الملف الشخصي'}</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="profile input_field"
                />
                {image && <img src={image} alt="Profile Preview" className="profile img_preview"/>}
              </div>
              <button onClick={handleSave} className="profile save_btn">
                {language === 'En' ? 'Save Changes' : 'حفظ التغييرات'}
              </button>
              <button onClick={() => setIsEditing(false)} className="profile cancel_btn">
                {language === 'En' ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
        )}
      </div>
  );
};

export default Profile;
