import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./quiz.css";
import CorrectIcon from "../assets/correct.png"
import WrongIcon from "../assets/wrong.png"


const QuizPage = () => {
  // State to store the list of questions
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const questionsPerPage = 8; 

  // Simulated API call to fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        correctRate: Math.random() * 100, // Random correct rate
        errorRate: Math.random() * 100, // Random error rate
      }));
      setQuestions(mockData);
    };

    fetchQuestions();
  }, []);

  // Get questions for the current page
  const displayedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  return (
    <>
      
      <div className="quiz-container">
        {displayedQuestions.map((question) => (
          <button
          key={question.id}
          className="quiz-card"
          onClick={() => goToTest(question.id)}
        >
            <div
              className={`quiz-number ${
                question.correctRate > question.errorRate ? "green" : "red"
              }`}
            >
              {question.id}
            </div>
            <div className="quiz-label-container">
              <div className="quiz-label green">
                <img src={CorrectIcon} alt="Correct icon" />
                <span>{question.correctRate.toFixed(0)}%</span>
              </div>
              <div className="quiz-label orange">
                <span>{question.errorRate.toFixed(0)}%</span>
                <img src= {WrongIcon} alt="Error icon" />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="quiz-pagination">
        <a
          href="#"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        >
          «
        </a>
        {Array.from(
          { length: Math.ceil(questions.length / questionsPerPage) },
          (_, i) => (
            <a
              key={i}
              href="#"
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </a>
          )
        )}
        <a
          href="#"
          onClick={() =>
            handlePageChange(
              Math.min(
                currentPage + 1,
                Math.ceil(questions.length / questionsPerPage)
              )
            )
          }
        >
          »
        </a>
      </div>
    </>
  );
};

export default QuizPage;
