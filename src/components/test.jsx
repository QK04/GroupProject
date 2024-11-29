import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./test.css";
import TopBar from "./Topbar";

const MultipleChoiceLayout = ({ toggleSidebar, toggleHistory, onLogout }) => {
  const { testId } = useParams(); // Get test number from the route
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const mockData = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}: What is your answer?`,
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      }));
      setQuestions(mockData);
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleNavigation = (direction) => {
    setCurrentQuestionIndex((prev) =>
      direction === "next"
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Your answers have been submitted!");
  };

  return (
    <>
    <TopBar
        toggleSidebar={toggleSidebar}
        toggleHistory={toggleHistory}
        onLogout={onLogout}
      />
    <div className="test-container">
      {/* Sidebar for question navigation */}
      <div className="test-sidebar">
        <h4>Quiz Navigation</h4>
        <div className="navigation-buttons">
          {Array.from({ length: questions.length }, (_, i) => (
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
          Finish Attempt
        </button>
      </div>

      {/* Main question section */}
      <div className="question-section">
        <h4>Test Number: {testId}</h4>
        {questions.length > 0 && (
          <>
            <h2>{questions[currentQuestionIndex].text}</h2>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <label key={idx} className="option-label">
                  <input
                  
                    type="radio"
                    name={`question${questions[currentQuestionIndex].id}`}
                    value={option}
                    checked={
                      answers[questions[currentQuestionIndex].id] === option
                    }
                    onChange={() =>
                      handleAnswerChange(
                        questions[currentQuestionIndex].id,
                        option
                      )
                    }
                  />
                  {option}
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
    </>
  );
};

export default MultipleChoiceLayout;
