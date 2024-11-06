import React, {useContext, useState} from 'react'
import styles from "./MobileHeader.module.css"
import logo from "../Header/images/logo.jpg"
import menu from "./images/menu.png"
import { PagesLinks, HeaderItems } from "../index"
import Notifications from "../Notifications/Notifications";
import UserContext from "../../context/UserContext";

const MobileHeader = () => {
    const {language, isDarkMode, role, userId, auth, name, toggleLanguage, toggleTheme} = useContext(UserContext);
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <nav className={`${styles.mobileNav} ${isDarkMode ? styles.dark : ""}`}>
                <img src={logo} alt="Logo" className={styles.logo} />
                {role === "student" ? <Notifications userId={userId} /> : null}
                <button onClick={() => setIsVisible(true)}>
                    <img src={menu} alt="menu icon" />
                </button>
            </nav>
            <div onClick={() => setIsVisible(false)} className={`${styles.layout} ${isVisible ? "" : styles.hidden}`}/>
            <div className={`${styles.drawer} ${isVisible ? "" : styles.hidden} ${isDarkMode ? styles.dark : ""}`}>
                <PagesLinks/>
                <HeaderItems/>
            </div>
        </>
    )
}

export default MobileHeader