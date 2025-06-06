import {Link, useNavigate} from "react-router-dom";
import moonIcon from "../Header/images/night.png";
import sunIcon from "../Header/images/sun.png";
import axios from '../../api/axios';
import styles from '../Header/Header.module.css'
import {useContext} from "react";
import UserContext from "../../context/UserContext";


function HeaderItems () {
    const { language, auth, isDarkMode, name, toggleLanguage, toggleTheme, userId } = useContext(UserContext);

    const navigate = useNavigate();
    const handleSignOut = () => {
        axios.post('/api/auth/signOut', {userId})
            .then(res => {
                navigate('/');
                window.location.reload();
            }).catch(err => console.log(err));
    };

    return (
      <div className={styles.headerContent}>
        <div className={`${styles.headerItem} ${styles.themeToggle}`} id={"username"}>
          <Link to={`/Profile/${userId}`}>{auth ? name : null}</Link>
        </div>
        <div
          className={`${styles.headerItem} language`}
          onClick={toggleLanguage}
          style={{ cursor: "pointer" }}
        >
          {language === "En" ? "En" : "عربي"}
        </div>
        <div className={`${styles.headerItem} ${styles.themeToggle}`} onClick={toggleTheme}>
          {isDarkMode ? (
            <img src={moonIcon} className={styles.invert} alt="moon icon" />
          ) : (
            <img src={sunIcon} alt="sun icon" />
          )}
        </div>
        <div className={`${styles.headerItem} ${styles.primary}`} id="link">
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
      </div>
    );
}

export default HeaderItems;