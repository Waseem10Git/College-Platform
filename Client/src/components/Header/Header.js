import {Link} from 'react-router-dom';
import styles from './Header.module.css';
import logo from './images/logo.jpg';
import { HeaderItems, Notifications } from ".."

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
