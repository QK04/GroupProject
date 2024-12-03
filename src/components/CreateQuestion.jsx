import React, { useState, useEffect } from "react";
import "./CreateQuestion.css"; // Import the CSS file

const CreateQuestion = ({ addNewQuestion, editingQuestion }) => {
  const [newQuestion, setNewQuestion] = useState({
    subject: "",
    chapter: "",
    content: "",
    options: ['', '', '', ''], // Multiple choice options A, B, C, D
    correctAnswer: '' // Store the correct answer
  });

  // Effect hook to populate the form when editing an existing question
  useEffect(() => {
    if (editingQuestion) {
      setNewQuestion({
        subject: editingQuestion.subject,
        chapter: editingQuestion.chapter,
        content: editingQuestion.content,
        options: editingQuestion.options || ['', '', '', ''],
        correctAnswer: editingQuestion.correctAnswer || ''
      });
    }
  }, [editingQuestion]); // Only run when editingQuestion changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion((prevState) => ({
      ...prevState,
      options: updatedOptions
    }));
  };

  const handleAddQuestion = () => {
    if (
      newQuestion.content &&
      newQuestion.subject &&
      newQuestion.chapter &&
      newQuestion.options.every((option) => option) &&
      newQuestion.correctAnswer
    ) {
      addNewQuestion(newQuestion); // Call the function passed from parent to add the new question
      setNewQuestion({ subject: "", chapter: "", content: "", options: ['', '', '', ''], correctAnswer: '' }); // Clear input fields after adding
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="box">
      <div>
        <label>Subject</label>
        <select name="subject" value={newQuestion.subject} onChange={handleInputChange}>
          <option value="">Choose one..</option>
          <option value="Python">Python</option>
          {/* Add other subjects as needed */}
        </select>
      </div>

      <div>
        <label>Chapter</label>
        <select name="chapter" value={newQuestion.chapter} onChange={handleInputChange}>
          <option value="">Choose one..</option>
          <option value="Chapter 1">Chapter 1</option>
          <option value="Chapter 2">Chapter 2</option>
          {/* Add other chapters as needed */}
        </select>
      </div>

      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={newQuestion.content}
          onChange={handleInputChange}
          rows="4"
          style={{ width: "100%", padding: "10px", fontSize: "14px" }}
          placeholder="Enter the question content here"
        />
      </div>

      <div>
        <label>Option A</label>
        <input
          type="text"
          value={newQuestion.options[0]}
          onChange={(e) => handleOptionChange(0, e.target.value)}
          placeholder="Enter Option A"
        />
      </div>

      <div>
        <label>Option B</label>
        <input
          type="text"
          value={newQuestion.options[1]}
          onChange={(e) => handleOptionChange(1, e.target.value)}
          placeholder="Enter Option B"
        />
      </div>

      <div>
        <label>Option C</label>
        <input
          type="text"
          value={newQuestion.options[2]}
          onChange={(e) => handleOptionChange(2, e.target.value)}
          placeholder="Enter Option C"
        />
      </div>

      <div>
        <label>Option D</label>
        <input
          type="text"
          value={newQuestion.options[3]}
          onChange={(e) => handleOptionChange(3, e.target.value)}
          placeholder="Enter Option D"
        />
      </div>

      <div>
        <label>Correct Answer</label>
        <select
          name="correctAnswer"
          value={newQuestion.correctAnswer}
          onChange={handleInputChange}
        >
          <option value="">Choose the correct answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleAddQuestion}>Save</button>
      </div>
    </div>
  );
};

export default CreateQuestion;
