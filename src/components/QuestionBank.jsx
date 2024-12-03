import React, { useState } from "react";
import CreateQuestion from "./CreateQuestion";
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";
import './QuestionBank.css'

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]); // Initialize with an empty array
  const [editingQuestion, setEditingQuestion] = useState(null); // To hold the question being edited
  const [showCreateQuestion, setShowCreateQuestion] = useState(false); // State to show/hide CreateQuestion form
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const addNewQuestion = (newQuestion) => {
    const newId = questions.length + 1;
    setQuestions([...questions, { id: newId, ...newQuestion }]);
    setEditingQuestion(null); // Reset the editing state after adding
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id)); // Remove the question by id
  };

  const editQuestion = (question) => {
    setEditingQuestion(question); // Set the question to be edited
    setShowCreateQuestion(true); // Show the CreateQuestion form when editing
  };
  const toggleCreateQuestion = () => {
    setShowCreateQuestion(!showCreateQuestion); // Toggle visibility of the CreateQuestion form
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="container">
    <div className="question-table">
    <TopBar toggleSidebar={toggleSidebar}/>
      
      {/* Sidebar is displayed based on the `isSidebarOpen` state */}
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Button to show/hide CreateQuestion form */}
      <button onClick={toggleCreateQuestion} style={{ marginBottom: "20px" }}>
        {showCreateQuestion ? "Cancel" : "Create Question"}
      </button>

      {/* Show CreateQuestion form if showCreateQuestion is true */}
      {showCreateQuestion && (
        <CreateQuestion 
          addNewQuestion={addNewQuestion} 
          editingQuestion={editingQuestion} 
        />
      )}

      <table border="1">
      <colgroup>
    <col style={{ width: "10%" }} /> {/* ID column */}
    <col style={{ width: "40%" }} /> {/* Content column */}
    <col style={{ width: "20%" }} /> {/* Subject column */}
    <col style={{ width: "15%" }} /> {/* chapter column */}
    <col style={{ width: "15%" }} /> {/* Action column */}
        </colgroup>
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
          <td colSpan="5" style={{ textAlign: "center" }}>No questions available</td>
        </tr>
      ) : (
        questions.map((question) => (
          <tr key={question.id}>
            <td className="id">{question.id}</td>
            <td className="content">{question.content}</td>
            <td className="subject">{question.subject}</td>
            <td className="chapter">{question.chapter}</td>
            <td>
              <button onClick={() => deleteQuestion(question.id)}>
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
    </div>
  );
};

export default QuestionBank;