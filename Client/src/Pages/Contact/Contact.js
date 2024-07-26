import React from 'react';
import './Contact.css'

const ContactPage = ({ language, isDarkMode }) => {
  return (
    <div className={`contact-page ${isDarkMode ? 'dark' : 'light'}`}>
    <div className="contact-container">
      <h2>{language === 'En' ? 'Contact Us' : 'اتصل بنا'}</h2>
      <form className="contact-form">
        <div className="form-group">
          <input type="text" id="name"  placeholder={language === 'En' ? 'Name' : 'الاسم'} name="name" />
        </div>
        <div className="form-group">
          <input type="email" id="email" placeholder={language === 'En' ? 'Email' : 'البريد الإلكتروني'} name="email" />
        </div>
        <div className="form-group">
          <textarea id="message" placeholder={language === 'En' ? 'Message' : 'الرسالة'} name="message"></textarea>
        </div>
        <div className='buttonContainer'>
          <button type="submit">{language === 'En' ? 'Submit' : 'إرسال'}</button>
        </div>
        
      </form>
    </div>
    </div>
  );
}

export default ContactPage;