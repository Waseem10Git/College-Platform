import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NavBar, Footer, Header, MobileHeader, PublicUser, AdminUser, StudentInstructorUser, InstructorUser} from './components'
import {FileUpload, Home, Contact, SignIn, Accounts, MakeExam, ExamPreview, ExamResults, ExamResultDetails, TakeExam,
    ChapterUpload, ChapterInstall, AdminCourses, Course, Profile, UploadAssignment, Assignments, AllNotifications} from './Pages'

import axios from './api/axios';
import UserContext from "./context/UserContext";

function App() {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState(null);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'En');
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const toggleLanguage = () => {
        setLanguage(prevLanguage => (prevLanguage === 'En' ? 'Ar' : 'En'));
        document.documentElement.setAttribute('dir', language === 'En' ? 'rtl' : 'ltr');
    };
    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const userValues = {
        auth, setAuth, name, setName, role, setRole, userId, setUserId, language, setLanguage, isDarkMode, setIsDarkMode, toggleLanguage, toggleTheme
    };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('/api/auth',{withCredentials: true})
        .then(res => {
          console.log("Server response:", res.data); // Log the server response
          if (res.data.Status === "Success") {
            console.log("User authenticated: ", res.data.firstName); // Log the firstName
            setAuth(true);
            setName(res.data.firstName);
            setRole(res.data.role);
            setUserId(res.data.id);
              console.log("User ID set to: ", res.data.id);
          } else {
            console.log("Authentication failed: ", res.data.Error); // Log the error
            setAuth(false);
            // alert(res.data.Error);
          }
        })
        .catch(err => {
          console.error("Error fetching auth status: ", err); // Log network errors
        });
  }, []);


  return (
    <div className="App">
      <Router>
          <UserContext.Provider value={userValues}>
              <ToastContainer/>
              <MobileHeader/>
              <Header/>
              <NavBar/>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/SignIn" element={ <SignIn/> }/>
                  {role === "admin" ? (
                      <>
                          <Route path="/Accounts" element={ <Accounts/> }/>
                          <Route path="/AdminCourse" element={ <AdminCourses/> }/>
                          <Route path="*" element={ <Navigate to={"/"}/>}/>
                      </>
                  ) : role === "instructor" ? (
                      <>
                          <Route path="/ChapterInstall" element={<ChapterInstall/>}/>
                          <Route path="/MakeExam" element={ <MakeExam/> }/>
                          <Route path="/ExamPreview" element={ <ExamPreview/> }/>
                          <Route path="/ExamResults" element={ <ExamResults/> }/>
                          <Route path="/FileUpload" element={<FileUpload/> }/>
                          <Route path="/UploadAssignment" element={ <UploadAssignment/> }/>
                          <Route path="/Course/:userId" element={ <Course/> }/>
                          <Route path="/ExamResultDetails" element={ <ExamResultDetails/> }/>
                          <Route path="/ChapterUpload/:courseCode/:userId" element={ <ChapterUpload/> }/>
                          <Route path="*" element={ <Navigate to={"/"}/> }/>
                      </>
                  ) : role === "student" ? (
                      <>
                          <Route path="/ChapterInstall" element={<ChapterInstall/>}/>
                          <Route path="/TakeExam" element={<TakeExam/> }/>
                          <Route path="/Assignments" element={<Assignments/> }/>
                          <Route path="/Course/:userId" element={ <Course/> }/>
                          <Route path="/notifications" element={ <AllNotifications/>}/>
                          <Route path="/ExamResultDetails" element={ <ExamResultDetails/> }/>
                          <Route path="/Profile" element={ <Profile/> }/>
                          <Route path="/ChapterUpload/:courseCode/:userId" element={ <ChapterUpload/> }/>
                          <Route path="*" element={ <Navigate to={"/"}/> }/>
                      </>
                  ) : null};
              </Routes>
              <Footer/>
          </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;

