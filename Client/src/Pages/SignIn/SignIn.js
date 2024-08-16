import React, {useState} from 'react';
import './SignIn.css';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

const SignIn = ({ language, isDarkMode }) => {
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
                    navigate('/');
                    window.location.reload();
                } else {
                    alert(res.data.Error);
                }
            })
            .catch(err => {
                console.error(err);
                // alert("Failed");
            });
        console.log('Submitted data:', formData);
    };

  return (
    <div className={`signin ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='form-container'>
      <h2>{language === 'En' ? 'Sign In' : 'تسجيل الدخول'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" id="email" placeholder={language === 'En' ? 'Email:' : ' الايميل:'} name="username"
               onChange={event => setFormData({...formData, email: event.target.value})}/>
        <input type="password" id="password" placeholder={language === 'En' ? 'Password:' : 'كلمة المرور:'} name="password"
               onChange={event => setFormData({...formData, password: event.target.value})}/>
        <div className="remember-forgot">
          <div className="remember">
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">{language === 'En' ? 'Remember me' : 'تذكرني'}</label>
          </div>
          <a href="_blank" className="forgot-password">{language === 'En' ? 'Forgot password?' : 'نسيت كلمة المرور؟'}</a>
        </div>
        <button type="submit">{language === 'En' ? 'Sign In' : 'تسجيل الدخول'}</button>
      </form>
      </div>
    </div>
  );
};

export default SignIn;
