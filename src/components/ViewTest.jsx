import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./ViewTest.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ViewTest = () => {
  const { testId } = useParams(); // Get testId from URL
  const [testDetails, setTestDetails] = useState(null);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        if (testDetails?.test_id) {
          await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/test/${testDetails.test_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          alert("Test deleted successfully!");
          navigate("/FullListTest"); // Navigate to test list
        }
      } catch (err) {
        console.error("Error deleting test:", err);
        alert("An error occurred while deleting the test.");
      }
    }
  };

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/${testId}/teacher`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const parsedBody = JSON.parse(response.data.body);
        if (parsedBody) setTestDetails(parsedBody);
        else setError("Invalid response format from API.");
      } catch (err) {
        setError(err.message || "Error fetching test details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        setStudentLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test/${testId}/teacher/get-userscore`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const parsedBody = JSON.parse(response.data.body);
        if (parsedBody && parsedBody.students) {
          setStudents(parsedBody.students);
        } else {
          setError("Invalid response format for students API.");
          setStudents([]);
        }
      } catch (err) {
        setError(err.message || "Error fetching students' scores.");
      } finally {
        setStudentLoading(false);
      }
    };

    fetchTestDetails();
    fetchStudents();
  }, [testId]);

  if (loading || studentLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Prepare data for Chart.js
  const scoreCounts = Array(11).fill(0); // Buckets from 0 to 10
  students.forEach((student) => {
    const score = Math.min(student.score, 10); // Cap scores at 10
    scoreCounts[score]++;
  });

  const chartData = {
    labels: ["<=1", "<=2", "<=3", "<=4", "<=5", "<=6", "<=7", "<=8", "<=9", "<=10"],
    datasets: [
      {
        label: "Number of Students",
        data: scoreCounts.slice(1), // Skip the first zero index
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="view-test-container">
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <h1 className="view-test-title">Test Details</h1>
      {testDetails && (
        <div className="test-info">
          <p><strong>Test ID:</strong> {testDetails.test_id}</p>
          <p><strong>Time Limit:</strong> {testDetails.time_limit} minutes</p>
          <p><strong>Created At:</strong> {new Date(testDetails.created_at).toLocaleString()}</p>
          <button className="delete-button" onClick={handleCancel}>
            Delete Test
          </button>
        </div>
      )}

      <h2 className="questions-title">Questions</h2>
      <div className="questions-list">
        {testDetails?.questions.map((question, index) => (
          <div className="question-item" key={question.question_id}>
            <p className="question-text">
              <strong>Q{index + 1}:</strong> {question.question_text}
            </p>
            <ul className="choices-list">
              {question.choices.map((choice) => (
                <li
                  key={choice.choice_id}
                  className={`choice-item ${choice.is_correct ? "correct-choice" : ""}`}
                >
                  {choice.choice_text}
                  {choice.is_correct && <span className="correct-label"> (Correct)</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add Bar Chart Here */}
      <h2 className="chart-title">Score Statistics</h2>
      <Bar data={chartData} options={chartOptions} />

      {/* Students Table */}
      <h2 className="students-title">Students Scores</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.student_id}>
              <td>{index + 1}</td>
              <td>{student.student_id}</td>
              <td>{student.student_name || "N/A"}</td>
              <td>{student.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTest;
