import React, { useState } from "react";
import axios from "../api/axios";
import "./TestCreationOptions.css";
import RandomlyCreateTest from "./RandomlyCreateTest";
import ManualCreateTest from "./ManualCreateTest";

const TestCreationOptions = () => {
  const [selectedOption, setSelectedOption] = useState(null); // Track which option is selected
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Handle manual test creation button click
  const handleManualCreation = () => {
    setSelectedOption("manual");
  };

  // Handle random test creation button click
  const handleRandomCreation = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/create-test`,
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
        setSelectedOption("random");
      } else {
        alert("Failed to create random test.");
      }
    } catch (err) {
      console.error("Error creating random test:", err);
      alert("An error occurred while creating the random test.");
    }
  };

  return (
    <div className="test-creation-options-container">
      <h1>Choose Test Creation Method</h1>
      <div className="button-group">
        <button
          className="manual-create-button"
          onClick={handleManualCreation}
        >
          Create Test Manually
        </button>
        <button
          className="random-create-button"
          onClick={handleRandomCreation}
        >
          Create Test Randomly
        </button>
      </div>

      <div className="test-creation-content">
        {selectedOption === "manual" && (
          <div className="manual-create-container">
            <ManualCreateTest />
          </div>
        )}
        {selectedOption === "random" && (
          <div className="random-create-container">
            <RandomlyCreateTest />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCreationOptions;
