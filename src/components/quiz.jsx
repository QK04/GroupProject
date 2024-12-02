import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./quiz.css";
import CorrectIcon from "../assets/correct.png";
import WrongIcon from "../assets/wrong.png";

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); // List of quizzes
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const questionsPerPage = 8;

  // Fetch data from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://1u5xjkwdlg.execute-api.us-east-1.amazonaws.com/prod/test"
        );

        // Parse the API response
        const data = JSON.parse(response.data.body);
        const testIds = data.test_ids;

        // Map the test IDs to your quiz data structure
        const quizData = testIds.map((id, index) => ({
          id, // Use the test ID from the API
          testNumber: index + 1, // Add human-readable test number
          correctRate: Math.random() * 100, // Simulate correct rate
          errorRate: Math.random() * 100, // Simulate error rate
        }));

        setQuestions(quizData); // Set the questions state
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
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

  // Navigate to the test page
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
              }`}>
              Test {question.testNumber}
            </div>
            <div className="quiz-label-container">
              <div className="quiz-label green">
                <img src={CorrectIcon} alt="Correct icon" />
                <span>{question.correctRate.toFixed(0)}%</span>
              </div>
              <div className="quiz-label orange">
                <span>{question.errorRate.toFixed(0)}%</span>
                <img src={WrongIcon} alt="Error icon" />
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
