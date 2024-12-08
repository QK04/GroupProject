import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./FullListTest.css";

const FullListTest = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Lấy danh sách bài kiểm tra
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const parsedBody = JSON.parse(response.data.body);
        if (response.status === 200 && parsedBody.tests) {
          // Sắp xếp theo `created_at` (giảm dần)
          const sortedTests = parsedBody.tests.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          setTests(sortedTests);
        } else {
          setError("Failed to fetch tests.");
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError(err.message || "Error fetching tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Điều hướng đến trang tạo bài kiểm tra
  const handleCreateTest = () => {
    navigate("/TestCreationOptions");
  };

  // Điều hướng về trang Teacher Dashboard
  const handleBackToDashboard = () => {
    navigate("/teacher-dashboard"); // Điều hướng về trang Teacher Dashboard
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="full-list-test-container">
      <h1 className="full-list-test-title">Full List of Tests</h1>
      
      {/* Nút quay lại trang TeacherDashboard */}
      <button className="back-to-dashboard-button" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
      
      <button className="create-test-button" onClick={handleCreateTest}>
        Create Test
      </button>
      <div className="tests-list">
        {tests.length > 0 ? (
          tests.map((test, index) => (
            <div
              className="test-item"
              key={test.test_id} // Sử dụng test_id làm key
              onClick={() => navigate(`/ViewTest/${test.test_id}`)}
            >
              <span className="test-label">Test-{index + 1}</span>
              <span className="test-id">{test.test_id}</span>
              <span className="test-date">
                {new Date(test.created_at).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p>No tests available. Create a new test to get started!</p>
        )}
      </div>
    </div>
  );
};

export default FullListTest;
