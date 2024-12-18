import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
import "./TestDetailsPage.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";

const TestDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  const { testId } = useParams(); // Get the test ID from the route
  const { user } = useAuth(); // Access the `user` object from AuthContext
  const [testDetails, setTestDetails] = useState(null); // Store test details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!user || !user.user_id || !user.access_token) {
        setError("User authentication is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch test details using the provided API
        const response = await axios.get(
          `https://1u5xjkwdlg.execute-api.us-east-1.amazonaws.com/prod/test/${testId}/student/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseBody = JSON.parse(response.data.body);
        console.log("Test Details Response:", responseBody);

        // Handle "Not Attempted" or "Not Completed" tests as the same case
        if (
          responseBody.message === "Tests fetched successfully" ||
          responseBody.message === "Test not completed. Starting now."
        ) {
          setTestDetails({
            test_id: responseBody.test_id,
            status: "Not Attempted",
          });
        } else if (responseBody.message === "You have already completed this test.") {
          // The student has completed the test, show the results
          setTestDetails({
            test_id: responseBody.test_id,
            status: "Completed",
            testResult: responseBody.testResult,
          });
        } else {
          setError("Unexpected response from the server.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch test details:", err);
        setError("Failed to load test details. Please try again later.");
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId, user]);

  if (loading) return <p>Loading test details...</p>;
  if (error) return <p>{error}</p>;

  const handleStartTest = () => {
    navigate(`/test/${testId}`);
  };

  const handleViewResults = () => {
    navigate(`/results/${testId}`, {
      state: {
        userId: user.user_id,
      },
    });
  };

  return (
    <div className="test-details-container">
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h2>Test Details</h2>
      {testDetails ? (
        <>
          <p><strong>Test ID:</strong> {testDetails.test_id}</p>

          {/* Case 1: Test Not Attempted */}
          {testDetails.status === "Not Attempted" ? (
            <>
              <p>This test has not been attempted yet.</p>
              <button onClick={handleStartTest} className="start-button">
                Start Test
              </button>
            </>
          ) : /* Case 2: Test Completed */ (
            <>
              <p><strong>Status:</strong> {testDetails.status}</p>
              {testDetails.testResult ? (
                <>
                  <p><strong>Test Score:</strong> {testDetails.testResult.test_point}</p>
                  <p><strong>Submitted At:</strong> {new Date(testDetails.testResult.submitted_at).toLocaleString()}</p>
                  <button onClick={handleViewResults} className="start-button">
                    View Results
                  </button>
                </>
              ) : (
                <p>No result available for this test.</p>
              )}
            </>
          )}
        </>
      ) : (
        <p>Test details are unavailable.</p>
      )}
    </div>
  );
};

export default TestDetailsPage;
