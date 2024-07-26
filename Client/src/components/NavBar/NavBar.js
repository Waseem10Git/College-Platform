import React, {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import PagesLinks from "../PagesLinks/PagesLinks";
const NavBar = ({
    language,
    toggleLanguage,
    isDarkMode,
    toggleTheme,
    Role,
    relative,
    fixed,
    userId
}) => {



    return (
        <div className={`navbar ${isDarkMode ? 'dark-mode-navbar' : 'navbar'}`}>
            <div className='container'>
                <PagesLinks
                    language={language}
                    Role={Role}
                    isDarkMode={isDarkMode}
                    toggleLanguage={toggleLanguage}
                    toggleTheme={toggleTheme}
                    relative={relative}
                    fixed={fixed}
                    userId={userId}
                />
            </div>
        </div>
    );
}

export default NavBar;
