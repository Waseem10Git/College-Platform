import styles from './NavBar.module.css';
import PagesLinks from "../PagesLinks/PagesLinks";
import {useContext} from "react";
import UserContext from "../../context/UserContext";
const NavBar = ({
    
}) => {
    
    const { isDarkMode} = useContext(UserContext);
    
    return (
        <div className={`${styles.navbar} ${isDarkMode ? styles.darkModeNavbar : styles.navbar}`}>
            <div className={styles.container}>
                <PagesLinks/>
            </div>
        </div>
    );
}

export default NavBar;
