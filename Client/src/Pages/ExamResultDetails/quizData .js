// src/quizData.js

const quizData = [
    {
      courseId: 'course1',
      courseName: 'Math 101',
      quizzes: [
        {
          quizId: 'quiz1',
          quizName: 'Basic Algebra',
          questions: [
            {
              questionId: 'q1',
              questionText: 'What is 2 + 2?',
              correctAnswer: '4',
              studentAnswer: '5'
            },
            {
              questionId: 'q2',
              questionText: 'What is the value of x in the equation 2x = 6?',
              correctAnswer: '3',
              studentAnswer: '3'
            },
            {
              questionId: 'q3',
              questionText: 'What is the value of x in the equation 3x = 6?',
              correctAnswer: '2',
              studentAnswer: '3'
            },
            {
              questionId: 'q4',
              questionText: 'What is the value of x in the equation 2x + 2 = 6?',
              correctAnswer: '2',
              studentAnswer: '2'
            },
            {
              questionId: 'q5',
              questionText: 'What is the value of x in the equation 2x * 2x = 36?',
              correctAnswer: '3',
              studentAnswer: '5'
            },
            {
              questionId: 'q6',
              questionText: 'What is the value of x in the equation 7x * 1/x = ?',
              correctAnswer: '7',
              studentAnswer: '7'
            },
            
            // Add more questions here
          ]
        },
        // Add more quizzes here
      ]
    },
    // Add more courses here
  ];
  
  export default quizData;
  