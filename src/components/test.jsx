import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./test.css";
import { useAuth } from "../context/authContext";

const MultipleChoiceLayout = () => {
  const { testId } = useParams(); // Get test ID from the route
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Access the `user` object from AuthContext
  const [score, setScore] = useState(null);


  // Fetch questions for the specific test
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!user || !user.access_token) {
          setError("User authentication is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://1u5xjkwdlg.execute-api.us-east-1.amazonaws.com/prod/test/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Parse the API response
        const responseData = JSON.parse(response.data.body);
        const fetchedQuestions = responseData.questions.map((question) => ({
          questionId: question.question_id, // Ensure this is the correct field
          text: question.question_text,
          options: question.choices.map((choice, idx) => ({
            optionId: idx + 1, // Assuming choices are 1-based
            text: choice.choice_text,
          })),
        }));
        console.log("API Response Data:", responseData);

        setQuestions(fetchedQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId, user]);

  const handleAnswerChange = (questionId, selectedOptionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOptionId, // Use `questionId` as the key
    }));
    console.log("Updated Answers:", answers);
  };

  const handleNavigation = (direction) => {
    setCurrentQuestionIndex((prev) =>
      direction === "next"
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  const handleSubmit = async () => {
    try {
      if (!user || !user.access_token) {
        alert("User authentication is missing.");
        return;
      }

      const payload = {
        user_id: user.user_id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: questionId,
          answer: answer.toString(),
        })),
        time_limit: 10, // Time user takes to finish the test
      };
      

      const response = await axios.post(
        `https://1u5xjkwdlg.execute-api.us-east-1.amazonaws.com/prod/test/${testId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Submission Response:", response.data);

      //show score
      const responseBody = JSON.parse(response.data.body);
      
      const testScore = responseBody.test_point;
      setScore(testScore); // Update the score state

      alert("Your answers have been submitted!");
    } catch (err) {
      console.error("Failed to submit answers:", err);
      alert("Failed to submit answers. Please try again later.");
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="test-container">
      {/* navigation */}
      {score !== null && <h3 className="test-score">Your Score: {score}</h3>}
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
          Finish Attempt
        </button>
      </div>

      
      <div className="question-section">
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
  );
};

export default MultipleChoiceLayout;
