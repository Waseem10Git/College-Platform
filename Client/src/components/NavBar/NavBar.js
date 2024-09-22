import styles from './NavBar.module.css';
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
        <div className={`${styles.navbar} ${isDarkMode ? styles.darkModeNavbar : styles.navbar}`}>
            <div className={styles.container}>
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
