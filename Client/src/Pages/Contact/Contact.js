import React, {useContext} from 'react';
import styles from './Contact.module.css'
import UserContext from "../../context/UserContext";

const ContactPage = () => {
  const { language, isDarkMode } = useContext(UserContext);
  return (
    <div className={`${styles.contactPage} ${isDarkMode ? styles.dark : styles.light}`}>
    <div className={styles.contactContainer}>
      <h2>{language === 'En' ? 'Contact Us' : 'اتصل بنا'}</h2>
      <form className={styles.contactForm}>
        <div className={styles.formGroup}>
          <input type="text" id="name"  placeholder={language === 'En' ? 'Name' : 'الاسم'} name="name" />
        </div>
        <div className={styles.formGroup}>
          <input type="email" id="email" placeholder={language === 'En' ? 'Email' : 'البريد الإلكتروني'} name="email" />
        </div>
        <div className={styles.formGroup}>
          <textarea id="message" placeholder={language === 'En' ? 'Message' : 'الرسالة'} name="message"></textarea>
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit">{language === 'En' ? 'Submit' : 'إرسال'}</button>
        </div>
        
      </form>
    </div>
    </div>
  );
}

export default ContactPage;