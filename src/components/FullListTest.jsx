import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./FullListTest.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";

const FullListTest = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Fetch list of tests
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const parsedBody = JSON.parse(response.data.body);
          if (parsedBody.tests) {
            const sortedTests = parsedBody.tests.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at) // Sort descending by `created_at`
            );
            setTests(sortedTests);
          } else {
            setError("No tests found.");
          }
        } else {
          setError("Failed to fetch tests. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError(err.message || "An error occurred while fetching tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [token]);

  const handleCreateTest = () => {
    navigate("/TestCreationOptions");
  };

  const handleBackToDashboard = () => {
    navigate("/teacher-dashboard");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="full-list-test-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="tests-list">
        <button className="back-to-dashboard-button" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>

        <button className="create-test-button" onClick={handleCreateTest}>
          Create Test
        </button>

        {loading ? (
          <p>Loading tests...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : tests.length > 0 ? (
          tests.map((test, index) => (
            <div
              className="test-item"
              key={test.test_id}
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
