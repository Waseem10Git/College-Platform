import React, { useState, useEffect } from 'react';
import './Quiz.css';
import quizQuestions from './quizQuestions'
import doneImage from "./images/thumbs-up.png"

const Quiz = ({isDarkMode}) => {
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load questions from JSON file
    fetch('quizQuestions.json')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const currentQuestion = questions[currentQuestionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
  };

  const renderQuiz = () => {
    if (questions.length === 0) {
      return <div>Loading...</div>;
    }

    if (currentQuestionIndex >= questions.length) {
      return (
        <div>
          <h2>Quiz Completed!</h2>
          <img src={doneImage} alt="Thumbs up"/>
          <p>Your Score: {score}/{questions.length}</p>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div>
        <h2>{currentQuestion.question}</h2>
        <ul>
          {currentQuestion.options.map((option, index) => (
            <li key={index} className='option'>
              <label className={selectedAnswer === index && "selected-option"}>
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={selectedAnswer === index} 
                  onChange={() => handleAnswerSelect(index)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      
          <button disabled={selectedAnswer == null} onClick={handleNextQuestion}>Next Question</button>
      </div>
    );
  };

  return (
    <div className={`quiz-page ${isDarkMode ? " dark" : ""}`}>
    <div className="quiz-container">
      <h1>Quiz</h1>
      {renderQuiz()}
    </div>
    </div>
  );
};

export default Quiz;
