import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./RandomlyCreateTest.css";

const RandomlyCreateTest = () => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/test/create-test-random`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const parsedBody = JSON.parse(response.data.body);

        if (response.status === 200 && parsedBody.test_id) {
          setTestData(parsedBody);
        } else {
          throw new Error("Failed to fetch test data.");
        }
      } catch (err) {
        console.error("Error fetching test data:", err);
        setError("An error occurred while creating the test.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [token]);

  const handleSubmit = () => {
    alert("Test submitted!");
  };

  const handleCancel = async () => {
    try {
      if (testData?.test_id) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/test/${testData.test_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      alert("Test canceled!");
      navigate("/FullListTest");
    } catch (err) {
      console.error("Error deleting test:", err);
      alert("An error occurred while deleting the test.");
    }
  };

  if (loading) return <p>Loading test data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="create-test-container">
      <h1 className="create-test-title">Create Test</h1>
      {testData ? (
        <>
          <div className="test-info">
            <p>Test ID: {testData.test_id}</p>
            <p>Start Time: {new Date(testData.start_time).toLocaleString()}</p>
            <p>End Time: {new Date(testData.end_time).toLocaleString()}</p>
          </div>
          <div className="questions-list">
            <h2>Selected Questions:</h2>
            {testData.questions.map((question, index) => (
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
