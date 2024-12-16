import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./quiz.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";

const QuizPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://1u5xjkwdlg.execute-api.us-east-1.amazonaws.com/prod/test"
        );

        const data = JSON.parse(response.data.body);
        const tests = data.tests;

        const quizData = tests.map((test, index) => ({
          id: test.test_id,
          testNumber: index + 1,
        }));

        setQuestions(quizData);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const displayedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToTestDetail = (testId) => {
    navigate(`/test/${testId}/details`);
  };

  return (
    <>
      <div className="quiz-container">
        <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {displayedQuestions.map((question) => (
          <button
            key={question.id}
            className="quiz-card"
            onClick={() => goToTestDetail(question.id)}
          >
            <div className="quiz-number">
              Test {question.testNumber}
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
