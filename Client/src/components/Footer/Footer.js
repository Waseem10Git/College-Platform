import React from 'react';
import './Footer.css';

const Footer = ({ language, isDarkMode , stick }) => {
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
