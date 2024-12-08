import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./TestCreationOptions.css";

const TestCreationOptions = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Hàm điều hướng đến trang tạo bài kiểm tra thủ công
  const handleManualCreation = () => {
    navigate("/ManualCreateTest"); // Điều hướng đến trang tạo thủ công
  };

  // Hàm xử lý tạo bài kiểm tra ngẫu nhiên
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
        // Điều hướng đến trang CreateTest với dữ liệu bài kiểm tra
        navigate("/CreateTest", { state: parsedBody });
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
        <button className="manual-create-button" onClick={handleManualCreation}>
          Create Test Manually
        </button>
        <button className="random-create-button" onClick={handleRandomCreation}>
          Create Test Randomly
        </button>
      </div>
    </div>
  );
};

export default TestCreationOptions;
