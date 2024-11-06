import {Link} from 'react-router-dom';
import styles from './Header.module.css';
import logo from './images/logo.jpg';
import { HeaderItems, Notifications } from ".."
import {useContext} from "react";
import UserContext from "../../context/UserContext";

const Header = () => {
  const {language, toggleLanguage, isDarkMode, toggleTheme, name, auth, role, userId} = useContext(UserContext);

  return (
    <header className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <Link to="/">
        <div className={styles.logo}>
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
