import { useState } from "react";
import "./CourseView.css";
import { useLocation, useNavigate } from "react-router-dom";
import CourseList from "../Courses/CourseList";

const CourseView = ({ isDarkMode, language, Role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;
  const [lectures, setLectures] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  const courseId = location.state ? location.state.courseId : null;
  const courseData = courseId
    ? CourseList.find((course) => course.id === courseId)
    : null;
  const courseimg = courseData ? courseData.imgUrl : null;

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      const newPdfFiles = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPdfFiles([...pdfFiles, ...newPdfFiles]);
      const newLectures = Array.from(files).map((file) => file.name);
      setLectures([...lectures, ...newLectures]);
    }
  };

  const handleDeleteLecture = (index) => {
    setLectures(lectures.filter((_, i) => i !== index));
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (Role) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    if (Role) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (Role) {
      setIsDragging(false);
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    }
  };

  const handleStartMeeting = () => {
    //setIsMeetingStarted(!isMeetingStarted);
        navigate("/Live");

  };

  const handleJoinMeeting = () => {
    navigate("/Live");
  };

  return (
    <div
      className={`course-view ${
        isDarkMode ? "dark-mode" : "light-mode"
      } ${language.toLowerCase()}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h1>{language === "En" ? "Lectures" : "المحاضرات"}</h1>
      {course && (
        <div className="course-header">
          <h2>{course.courseName}</h2>
          <h3>{course.doctorName}</h3>
          {courseimg && (
            <div className="course-img-wrapper">
              <img
                src={courseimg}
                alt={course.courseName}
                className="course-img"
              />
              <div className={`notch ${isMeetingStarted ? "green" : ""}`}></div>
            </div>
          )}
        </div>
      )}
      {Role && (
        <>
          <button
            className="btn add-lecture"
            onClick={() => document.getElementById("fileUpload").click()}
          >
            {language === "En" ? "Add New Lecture" : "أضف محاضرة جديدة"}
          </button>
          <button
            className={`btn start-meeting `}
            onClick={handleStartMeeting}
          >
            {language === "En" ? "Start Online Meeting" : "ابدأ ألإجتماع عبر الإنترنت"}
          </button>
        </>
      )}
      {!Role && (
        <>
          <button className="btn join-meeting" onClick={handleJoinMeeting}>
            {language === "En"
              ? "Join Online Meeting"
              : "إنضم إلى اجتماع عبر الإنترنت"}
          </button>
        </>
      )}
      <ul className="lecture-list">
        {lectures.map((lecture, index) => (
          <li key={index} className="lecture-item">
            <span>{lecture}</span>
            <a href={pdfFiles[index]} target="_blank" rel="noopener noreferrer">
              {language === "En" ? "View PDF" : "عرض ملف PDF"}
            </a>
            {Role && (
              <div
                className="delete-lecture"
                onClick={() => handleDeleteLecture(index)}
              >
                {language === "En" ? "Delete" : "حذف"}
              </div>
            )}
          </li>
        ))}
      </ul>
      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        id="fileUpload"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      {isDragging && Role && (
        <div className="drag-overlay">
          {language === "En"
            ? "Drop files here to upload"
            : "قم بإسقاط الملفات هنا لتحميلها"}
        </div>
      )}
    </div>
  );
};

export default CourseView;
