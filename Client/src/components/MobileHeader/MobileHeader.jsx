import React, {useState} from 'react'
import "./MobileHeader.css"
import logo from "../Header/images/logo.jpg"
import menu from "./images/menu.png"
import { PagesLinks, HeaderItems } from "../index"
import Notifications from "../Notifications/Notifications";

const MobileHeader = ({ language, toggleLanguage, isDarkMode, toggleTheme, Role, userId, auth, name }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <nav className={`mobile-nav ${isDarkMode ? "dark" : ""}`}>
                <img src={logo} alt="Logo" className='logo' />
                {Role === "student" ? <Notifications userId={userId} /> : null}
                <button onClick={() => setIsVisible(true)}>
                    <img src={menu} alt="menu icon" />
                </button>
            </nav>
            <div onClick={() => setIsVisible(false)} className={`layout ${isVisible ? "visible" : "hidden"}`}/>
            <div className={`drawer ${isVisible ? "visible" : "hidden"} ${isDarkMode ? "dark" : ""}`}>
                <PagesLinks
                    language={language}
                    Role={Role}
                    isDarkMode={isDarkMode}
                    toggleLanguage={toggleLanguage}
                    toggleTheme={toggleTheme}
                    userId={userId}
                />
                <HeaderItems isDarkMode={isDarkMode} language={language} name={name} auth={auth} toggleLanguage={toggleLanguage} toggleTheme={toggleTheme} userId={userId}/>
            </div>
        </>
    )
}

export default MobileHeader