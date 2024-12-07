import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuestionBank.css";
import CreateQuestion from "./CreateQuestion";
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [token]);

  const addNewQuestion = (newQuestion) => {
    setQuestions([...questions, { id: questions.length + 1, ...newQuestion }]);
    setEditingQuestion(null);
  };

  // Delete a question
  const deleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question? This action cannot be undone."
    );
    if (!confirmDelete) return;

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
        setQuestions(questions.filter((question) => question.quiz_id !== id));
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // Edit a question
  const editQuestion = (question) => {
    setEditingQuestion(question); // Set the question to be edited
    setShowCreateQuestion(true); // Show the CreateQuestion form
  };

  const saveEditedQuestion = async (updatedQuestion) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/quizquestions/${updatedQuestion.quiz_id}`,
        updatedQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.quiz_id === updatedQuestion.quiz_id ? updatedQuestion : q
          )
        );
        setEditingQuestion(null);
        setShowCreateQuestion(false);
      } else {
        console.error("Failed to update question");
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const toggleCreateQuestion = () => {
    setShowCreateQuestion(!showCreateQuestion);
    setEditingQuestion(null); // Reset editing state when toggling off
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <button onClick={toggleCreateQuestion} style={{ marginBottom: "20px" }}>
        {showCreateQuestion ? "Cancel" : "Create Question"}
      </button>

      {showCreateQuestion && (
        <CreateQuestion
          addNewQuestion={addNewQuestion}
          editingQuestion={editingQuestion}
          saveEditedQuestion={saveEditedQuestion}
        />
      )}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Content</th>
            <th>Subject</th>
            <th>Chapter</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No questions available
              </td>
            </tr>
          ) : (
            questions.map((question) => (
              <tr key={question.quiz_id}>
                <td>{question.quiz_id}</td>
                <td>{question.question_text}</td>
                <td>Python</td>
                <td>{question.chapter_name}</td>
                <td>
                  <button onClick={() => deleteQuestion(question.quiz_id)}>
                    <img src="src/assets/delete.png" alt="Delete" />
                  </button>
                  <button onClick={() => editQuestion(question)}>
                    <img src="src/assets/edit.png" alt="Edit" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
