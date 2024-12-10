import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./RandomlyCreateTest.css";

const RandomlyCreateTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  const { test_id, questions, start_time, end_time } = location.state || {};

  // Hàm xử lý khi nhấn nút Submit
  const handleSubmit = () => {
    // Giữ bài kiểm tra trong danh sách và điều hướng về FullListTest
    navigate("/FullListTest");
  };

  // Hàm xử lý khi nhấn nút Cancel
  const handleCancel = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/test/${test_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/FullListTest"); // Điều hướng về danh sách bài kiểm tra
    } catch (err) {
      console.error("Error deleting test:", err);
      alert("An error occurred while deleting the test.");
    }
  };

  return (
    <div className="create-test-container">
      <h1 className="create-test-title">Create Test</h1>
      {test_id ? (
        <>
          <div className="test-info">
            <p>Test ID: {test_id}</p>
            <p>Start Time: {new Date(start_time).toLocaleString()}</p>
            <p>End Time: {new Date(end_time).toLocaleString()}</p>
          </div>
          <div className="questions-list">
            <h2>Selected Questions:</h2>
            {questions.map((question, index) => (
              <div className="question-item" key={question.question_id}>
                <h3>
                  {index + 1}. {question.question_text}
                </h3>
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
          <div className="button-group">
            <button className="submit-test-button" onClick={handleSubmit}>
              Submit
            </button>
            <button className="cancel-test-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>No test data available.</p>
      )}
    </div>
  );
};

export default RandomlyCreateTest;
