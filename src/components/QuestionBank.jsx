import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./QuestionBank.css";
import CreateQuestion from "./CreateQuestion";
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]); // All questions
  const [filteredQuestions, setFilteredQuestions] = useState([]); // Filtered questions
  const [subjects, setSubjects] = useState([]); // List of subjects
  const [selectedSubject, setSelectedSubject] = useState(""); // Subject filter
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Pagination: Current page
  const questionsPerPage = 10; // Number of questions per page

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/quizquestions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const parsedData = JSON.parse(response.data.body);
          const questionsData = parsedData?.questions || [];
          setQuestions(questionsData);
          setFilteredQuestions(questionsData); // Initially show all questions
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [token]);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/subject`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = JSON.parse(response.data.body);
        if (Array.isArray(data.subjects)) {
          setSubjects(data.subjects); // Populate subject list
        } else {
          console.error("Invalid subject data format");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [token]);

  // Filter questions based on selected subject
  useEffect(() => {
    if (selectedSubject) {
      const filtered = questions.filter(
        (question) =>
          question.subject_name &&
          question.subject_name.toLowerCase() === selectedSubject.toLowerCase()
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions); // Show all questions when no subject is selected
    }
    setCurrentPage(1); // Reset to page 1 when filter changes
  }, [selectedSubject, questions]);

  const toggleCreateQuestion = () => {
    setShowCreateQuestion(!showCreateQuestion);
    setEditingQuestion(null); // Reset editing state
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const deleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/quizquestions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question.quiz_id !== id)
          );
          setFilteredQuestions((prevFilteredQuestions) =>
            prevFilteredQuestions.filter((question) => question.quiz_id !== id)
          );
        } else {
          console.error("Failed to delete question");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const editQuestion = (question) => {
    setEditingQuestion(question);
    setShowCreateQuestion(true);
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="question-bank-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="content">
        <div className="header">
          <button className="create-btn" onClick={toggleCreateQuestion}>
            {showCreateQuestion ? "Cancel" : "+ Create Question"}
          </button>

          {/* Subject Filter */}
          {!showCreateQuestion && (
            <div className="filter-container">
              <select
                className="filter-dropdown"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_name}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {showCreateQuestion ? (
          <CreateQuestion
            addNewQuestion={(newQuestion) => setQuestions([...questions, newQuestion])}
            editingQuestion={editingQuestion}
          />
        ) : (
          <>
            <div className="table-container">
              <table className="question-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Subject</th>
                    <th>Chapter</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuestions.length > 0 ? (
                    currentQuestions.map((question) => (
                      <tr key={question.quiz_id}>
                        <td>{question.quiz_id}</td>
                        <td>{question.question_text}</td>
                        <td>{question.subject_name}</td>
                        <td>{question.chapter_name}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => editQuestion(question)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => deleteQuestion(question.quiz_id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No questions available for the selected subject.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={
                      pageNumber === currentPage ? "active-page" : ""
                    }
                    onClick={() => paginate(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
