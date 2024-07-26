import {Link, useNavigate} from "react-router-dom";
import moonIcon from "../Header/images/night.png";
import sunIcon from "../Header/images/sun.png";
import React from "react";
import axios from "axios";


function HeaderItems ({ language, auth, isDarkMode, name, toggleLanguage, toggleTheme, userId }) {

    const navigate = useNavigate();
    const handleSignOut = () => {
        axios.get('http://localhost:4001/signOut')
            .then(res => {
                navigate('/');
                window.location.reload();
            }).catch(err => console.log(err));
    };

    return (
      <div className="header-content">
        <div className="header-item theme-toggle" id={"username"}>
          <Link to={`/Profile/${userId}`}>{auth ? name : null}</Link>
        </div>
        <div
          className="header-item language"
          onClick={toggleLanguage}
          style={{ cursor: "pointer" }}
        >
          {language === "En" ? "En" : "عربي"}
        </div>
        <div className="header-item theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? (
            <img src={moonIcon} className="invert" alt="moon icon" />
          ) : (
            <img src={sunIcon} alt="sun icon" />
          )}
        </div>
        <div className="header-item primary" id="link">
          {auth ? (
            <Link to="/SignIn" onClick={handleSignOut}>
              {language === "En" ? "Sign Out" : "تسجيل الخروج"}
            </Link>
          ) : (
            <Link to="/SignIn">
              {language === "En" ? "Sign In" : "تسجيل الدخول"}
            </Link>
          )}
        </div>
        {/*<div className="header-item go-live">*/}
        {/*  <Link to="/live" className="header-item primary ">*/}
        {/*    {language === "En" ? "Go Live" : "البث المباشر"}*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
    );
}

export default HeaderItems;