
import React, {useContext, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './Header.css';
import logo from './images/logo.jpg';
import moonIcon from "./images/night.png"
import sunIcon from "./images/sun.png"
import {AuthContext} from "../AuthContext/AuthContext";
import axios from "axios";
import HeaderItems from "../HeaderItems/HeaderItems";
import Notifications from "../Notifications/Notifications";

const Header = ({
  language,
  toggleLanguage,
  isDarkMode,
  toggleTheme,
  setShowHome,
  setShowSignIn,
    name,
    auth,
    role,
    userId
}) => {

    // const { auth, setAuth, name } = useContext(AuthContext);

  return (
    <header className={`header ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='container'>
        <Link to="/">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        </Link>
        {role === "student" ? <Notifications userId={userId} /> : null}
          <HeaderItems language={language} isDarkMode={isDarkMode} name={name} auth={auth} toggleLanguage={toggleLanguage} toggleTheme={toggleTheme} userId={userId}/>
      </div>
      
    </header>
  );
};

export default Header;
