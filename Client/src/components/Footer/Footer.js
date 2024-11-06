import React, {useContext} from 'react';
import './Footer.css';
import UserContext from "../../context/UserContext";

const Footer = () => {
  const { language, isDarkMode } = useContext(UserContext);
  const Year = new Date().getFullYear();
  return (
    <footer 
      className={`footer ${isDarkMode ? ' dark' : ' light'}`} id='footer'
    >
      <p>{language === 'En' ? `© ${Year} P R E M I U M. All Rights Reserved.` : `© ${Year} P R E M I U M. جميع الحقوق محفوظة.`}</p>
    </footer>
  );
}

export default Footer;
