import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./test.css";
import { useAuth } from "../context/authContext";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";

const MultipleChoiceLayout = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(
    JSON.parse(localStorage.getItem(`answers_${testId}`)) || {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); 
  const timerRef = useRef(null);

  // Toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleViewResults = () => {
    navigate(`/results/${testId}`, {
      state: {
        userId: user.user_id,
      },
    });
  };
  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/${testId}`,
          {
            headers: { Authorization: `Bearer ${user.access_token}` },
          }
        );

        const responseData = JSON.parse(response.data.body);
        setQuestions(responseData.questions);
      } catch (err) {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId, user]);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.hidden) {
        const confirmed = window.confirm(
          "You have switched tabs! Switching tabs is not allowed during the test. Click OK to submit your test now."
        );
  
        if (confirmed) {
          handleSubmit();
        } else {
          confirm("You have switched tabs! Switching tabs is not allowed during the test. Click OK to submit your test now.");
          handleSubmit();
        }
      }
    };
  
    document.addEventListener("visibilitychange", handleTabSwitch);
  
    return () => document.removeEventListener("visibilitychange", handleTabSwitch);
  }, []);
  

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(`answers_${testId}`, JSON.stringify(answers));
  }, [answers, testId]);

  // Submit answers
  const handleSubmit = async () => {
    clearInterval(timerRef.current);

    try {
      const payload = {
        user_id: user.user_id,
        answers: Object.entries(answers).map(([qId, answer]) => ({
          question_id: qId,
          answer: answer.toString(),
        })),
        time_limit: 600 - timeLeft, // Time spent
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/test/${testId}`,
        payload,
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      console.log("Submission Response:", response.data);

      //show score
      const responseBody = JSON.parse(response.data.body);
      
      const testScore = responseBody.test_point;
      setScore(testScore); // Update the score state
      handleViewResults();
      alert("Your answers have been submitted!");
    } catch (err) {
      alert("Error submitting the test. Please try again.");
    }
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="test-content">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    
    <div className="test-container">
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      
      <div className="test-sidebar">
        <h4>Quiz Navigation</h4>
        <div className="navigation-buttons">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestionIndex(i)}
              className={currentQuestionIndex === i ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button className="finish" onClick={handleSubmit}>
          Finish Test
        </button>
      </div>

      <div className="question-section">
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
        <h4>Test ID: {testId}</h4>
        {questions.length > 0 && (
          <>
            <h2>{questions[currentQuestionIndex].text}</h2>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option) => (
                <label key={option.optionId} className="option-label">
                  <input
                    type="radio"
                    name={`question${currentQuestionIndex}`}
                    value={option.optionId}
                    checked={
                      answers[questions[currentQuestionIndex].questionId] ===
                      option.optionId
                    }
                    onChange={() =>
                      handleAnswerChange(
                        questions[currentQuestionIndex].questionId,
                        option.optionId
                      )
                    }
                  />
                  {option.text}
                </label>
              ))}
            </div>
            <div className="button-container">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={() => handleNavigation("next")}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default MultipleChoiceLayout;