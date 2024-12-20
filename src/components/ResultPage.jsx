import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
import "./ResultPage.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";

const ResultPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  const { testId } = useParams(); 
  const { state } = useLocation(); 
  const { user } = useAuth(); 
  const [testResult, setTestResult] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Create a ref for each question to allow scrolling
  const questionRefs = useRef([]);

  useEffect(() => {
    const fetchTestResult = async () => {
      const userId = state?.userId || user?.user_id;

      if (!userId || !testId || !user?.access_token) {
        setError("Required parameters are missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/${testId}/student/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseBody = JSON.parse(response.data.body);
        console.log("Test Result Response:", responseBody);

        if (responseBody.message === "You have already completed this test.") {
          setTestResult(responseBody.testResult);
        } else {
          setError("Test result not found.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch test result:", err);
        setError("Failed to load test result. Please try again later.");
        setLoading(false);
      }
    };

    fetchTestResult();
  }, [testId, state, user]);

  if (loading) return <p>Loading test results...</p>;
  if (error) return <p>{error}</p>;

  if (!testResult || !testResult.answers) {
    return <p>No results available for this test.</p>;
  }

  // Scroll to the question when clicking on a navigation item
  const scrollToQuestion = (index) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="result-page">
    <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div className="result-page-container">
      {/* Left Navigation Bar */}
      <div className="result-page-nav">
        <h3>Questions</h3>
        <div className="result-page-grid">
          {testResult.answers.map((answer, index) => (
            <div
              key={index}
              className={`result-page-nav-item ${
                answer.is_correct ? "correct" : "incorrect"
              }`}
              onClick={() => scrollToQuestion(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="result-page-content">
        <h2>Test Results</h2>
        <p>
          <strong>Score:</strong> {testResult.test_point} / {testResult.answers.length}
        </p>

        <div className="result-page-questions">
          {testResult.answers.map((answer, index) => (
            <div
              key={index}
              ref={(el) => (questionRefs.current[index] = el)} // Assign each question a ref
              className="result-page-question-card"
            >
              <p>
                <strong>Question {index + 1}:</strong> {answer.question_text}
              </p>
              <div className="result-page-options">
                {answer.choices.map((choice) => (
                  <p
                    key={choice.choice_id}
                    className={`result-page-option ${
                      choice.choice_id === parseInt(answer.submitted_answer)
                        ? answer.is_correct
                          ? "correct"
                          : "incorrect"
                        : choice.is_correct
                        ? "correct"
                        : ""
                    }`}
                  >
                    {choice.choice_id}. {choice.choice_text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ResultPage;
