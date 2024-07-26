const quizData = [
    {
      courseId: 'course1',
      courseName: 'Math 101',
      quizzes: [
        {
          quizId: 'quiz1',
          quizName: 'Algebra Basics',
          questions: [
            {
              questionId: 'q1',
              questionText: 'What is 2 + 2?',
              options: ['3', '4', '5', '6'],
              correctAnswer: '4',
            },
            {
              questionId: 'q2',
              questionText: 'Solve for x: 3x = 9',
              options: ['1', '2', '3', '4'],
              correctAnswer: '3',
            },
            {
              questionId: 'q3',
              questionText: 'Solve for x: 2x + 4 = 14',
              options: ['2', '3', '4', '5'],
              correctAnswer: '5',
            },
            {
              questionId: 'q2',
              questionText: 'Solve for x: 3x*2x = 384',
              options: ['1', '2', '3', '4'],
              correctAnswer: '4',
            },
          ],
        },
        {
          quizId: 'quiz2',
          quizName: 'Geometry Basics',
          questions: [
            {
              questionId: 'q1',
              questionText: 'What is the sum of the angles in a triangle?',
              options: ['90', '180', '270', '360'],
              correctAnswer: '180',
            },
            {
              questionId: 'q2',
              questionText: 'What is the area of a circle with radius 3?',
              options: ['28.27', '18.85', '25.12', '31.42'],
              correctAnswer: '28.27',
            },
          ],
        },
      ],
    },
    {
      courseId: 'course2',
      courseName: 'Science 101',
      quizzes: [
        {
          quizId: 'quiz1',
          quizName: 'Physics Basics',
          questions: [
            {
              questionId: 'q1',
              questionText: 'What is the acceleration due to gravity on Earth?',
              options: ['8.9 m/s²', '9.8 m/s²', '10.2 m/s²', '9.2 m/s²'],
              correctAnswer: '9.8 m/s²',
            },
            {
              questionId: 'q2',
              questionText: 'What is the formula for force?',
              options: ['F = ma', 'F = mg', 'F = mv', 'F = mc²'],
              correctAnswer: 'F = ma',
            },
          ],
        },
        {
          quizId: 'quiz2',
          quizName: 'Chemistry Basics',
          questions: [
            {
              questionId: 'q1',
              questionText: 'What is the chemical symbol for water?',
              options: ['H2O', 'HO2', 'OH2', 'H2'],
              correctAnswer: 'H2O',
            },
            {
              questionId: 'q2',
              questionText: 'What is the atomic number of carbon?',
              options: ['4', '6', '8', '12'],
              correctAnswer: '6',
            },
          ],
        },
      ],
    },
  ];
  
  export default quizData;
  