import React from "react";


const TableExamResult = ({ isDarkMode, language, examQuestions, examAnswers, studentAnswers }) => {
  return (
      <table>
          <thead>
          <tr>
              <th>Question</th>
              <th>Correct Answer</th>
              <th>Your Answer</th>
          </tr>
          </thead>
          <tbody>
          {/*{quizQuestions.map(question => (*/}
          {/*    <tr key={question.questionId}>*/}
          {/*        <td>{question.questionText}</td>*/}
          {/*        <td>{question.correctAnswer}</td>*/}
          {/*        <td>{question.studentAnswer}</td>*/}
          {/*    </tr>*/}
          {/*))}*/}
          </tbody>
      </table>
  );
}

export default TableExamResult;