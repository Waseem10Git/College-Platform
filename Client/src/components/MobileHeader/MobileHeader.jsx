import React, {useState} from 'react'
import styles from "./MobileHeader.module.css"
import logo from "../Header/images/logo.jpg"
import menu from "./images/menu.png"
import { PagesLinks, HeaderItems } from "../index"
import Notifications from "../Notifications/Notifications";

const MobileHeader = ({ language, toggleLanguage, isDarkMode, toggleTheme, Role, userId, auth, name }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <nav className={`${styles.mobileNav} ${isDarkMode ? styles.dark : ""}`}>
                <img src={logo} alt="Logo" className={styles.logo} />
                {Role === "student" ? <Notifications userId={userId} /> : null}
                <button onClick={() => setIsVisible(true)}>
                    <img src={menu} alt="menu icon" />
                </button>
            </nav>
            <div onClick={() => setIsVisible(false)} className={`${styles.layout} ${isVisible ? "" : styles.hidden}`}/>
            <div className={`${styles.drawer} ${isVisible ? "" : styles.hidden} ${isDarkMode ? styles.dark : ""}`}>
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