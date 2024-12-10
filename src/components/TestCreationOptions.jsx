import React, { useState } from "react";
import "./TestCreationOptions.css";
import RandomlyCreateTest from "./RandomlyCreateTest";
import ManualCreateTest from "./ManualCreateTest";

const TestCreationOptions = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleManualCreation = () => {
    setSelectedOption("manual");
  };

  const handleRandomCreation = () => {
    setSelectedOption("random");
  };

  return (
    <div className="test-creation-options-container">
      <h1>Choose Test Creation Method</h1>
      <div className="button-group">
        <button className="manual-create-button" onClick={handleManualCreation}>
          Create Test Manually
        </button>
        <button className="random-create-button" onClick={handleRandomCreation}>
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
