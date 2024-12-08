import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import "./ViewTest.css";

const ViewTest = () => {
  const { testId } = useParams(); // Lấy testId từ URL
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);

        // Gửi yêu cầu đến API để lấy thông tin chi tiết bài kiểm tra
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/${testId}/teacher`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Parse JSON từ body
        const parsedBody = JSON.parse(response.data.body);

        if (parsedBody) {
          setTestDetails(parsedBody);
        } else {
          console.error("Unexpected data structure:", parsedBody);
          setError("Invalid response format from API.");
        }
      } catch (err) {
        console.error("Error fetching test details:", err);
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="view-test-container">
      <h1 className="view-test-title">Test Details</h1>
      {testDetails && (
        <>
          <div className="test-info">
            <p><strong>Test ID:</strong> {testDetails.test_id}</p>
            <p><strong>Time Limit:</strong> {testDetails.time_limit} minutes</p>
            <p><strong>Created At:</strong> {new Date(testDetails.created_at).toLocaleString()}</p>
          </div>
          <h2 className="questions-title">Questions</h2>
          <div className="questions-list">
            {testDetails.questions.map((question, index) => (
              <div className="question-item" key={question.question_id}>
                <p className="question-text">
                  <strong>Q{index + 1}:</strong> {question.question_text}
                </p>
                <ul className="choices-list">
                  {question.choices.map((choice) => (
                    <li
                      key={choice.choice_id}
                      className={`choice-item ${
                        choice.is_correct ? "correct-choice" : ""
                      }`}
                    >
                      {choice.choice_text}
                      {choice.is_correct && (
                        <span className="correct-label"> (Correct)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewTest;
