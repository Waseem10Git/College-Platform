import React, {useContext, useState} from 'react';
import './SignIn.css';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import {toast} from "react-toastify";

const SignIn = () => {
    const { language, isDarkMode } = useContext(UserContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/api/auth/signIn`, formData)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/', { replace: true });
                    window.location.reload();
                } else {
                    toast.error(res.data.Error);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed");
            });
        console.log('Submitted data:', formData);
    };

  return (
      <div className={`signIn ${isDarkMode ? 'signIn_dark' : 'signIn_light'}`}>
          <div className="signIn_formContainer">
              <h2>{language === 'En' ? 'Sign In' : 'تسجيل الدخول'}</h2>
              <form className='signIn_form' onSubmit={handleSubmit}>
                  <input type="text" id="email" placeholder={language === 'En' ? 'Email:' : ' الايميل:'} name="username"
                         onChange={event => setFormData({...formData, email: event.target.value})}/>
                  <input type="password" id="password" placeholder={language === 'En' ? 'Password:' : 'كلمة المرور:'}
                         name="password"
                         onChange={event => setFormData({...formData, password: event.target.value})}/>
                  <button type="submit">{language === 'En' ? 'Sign In' : 'تسجيل الدخول'}</button>
              </form>
          </div>
      </div>
  );
};

export default SignIn;
