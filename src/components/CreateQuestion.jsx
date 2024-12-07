import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateQuestion.css";

const CreateQuestion = ({ addNewQuestion, editingQuestion, saveEditedQuestion }) => {
  const [newQuestion, setNewQuestion] = useState({
    subject: "",
    chapter: "",
    content: "",
    options: ["", "", "", ""], 
    correctAnswer: "", 
  });
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]); 
  const [chapters, setChapters] = useState([]); 

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

    
  // Populate fields when editingQuestion is provided
  useEffect(() => {
    if (editingQuestion) {
      setNewQuestion({
        subject: editingQuestion.subject || "",
        chapter: editingQuestion.chapter_name || "",
        content: editingQuestion.question_text || "",
        options: editingQuestion.choices.map((choice) => choice.choice_text) || [
          "",
          "",
          "",
          "",
        ],
        correctAnswer:
          editingQuestion.choices.findIndex((choice) => choice.is_correct) >= 0
            ? String.fromCharCode(
                65 + editingQuestion.choices.findIndex((choice) => choice.is_correct)
              )
            : "",
      });
    }
  }, [editingQuestion]);

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/subject`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const data = JSON.parse(response.data.body);
          setSubjects(data.subjects || []);
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [token]);

  // Fetch chapters for the selected subject
  useEffect(() => {
    if (newQuestion.subject) {
      const fetchChapters = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/subject/${newQuestion.subject}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            const data = JSON.parse(response.data.body);
            setChapters(data || []);
          } else {
            console.error("Failed to fetch chapters");
          }
        } catch (error) {
          console.error("Error fetching chapters:", error);
        }
      };

      fetchChapters();
    } else {
      setChapters([]);
    }
  }, [newQuestion.subject, token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion((prevState) => ({
      ...prevState,
      options: updatedOptions,
    }));
  };

  // Handle save (create or edit)
  const handleAddOrEditQuestion = async () => {
    const requestBody = {
      chapter_name: newQuestion.chapter,
      type: "MCQ",
      question_text: newQuestion.content,
      choices: newQuestion.options.map((option, idx) => ({
        choice_text: option,
        is_correct: newQuestion.correctAnswer === String.fromCharCode(65 + idx),
      })),
    };

    setLoading(true);

    try {
      if (editingQuestion) {
        // Edit question
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/quizquestions/${editingQuestion.quiz_id}`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Question updated successfully!");
          saveEditedQuestion({ ...requestBody, quiz_id: editingQuestion.quiz_id });
        } else {
          alert("Failed to update the question.");
        }
      } else {
        // Create new question
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/quizquestions`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Question created successfully!");
          addNewQuestion(response.data);
          setNewQuestion({
            subject: "",
            chapter: "",
            content: "",
            options: ["", "", "", ""],
            correctAnswer: "",
          });
        } else {
          alert("Failed to create the question.");
        }
      }
    } catch (error) {
      console.error("Error saving the question:", error);
      alert("An error occurred while saving the question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <div>
        <label>Subject</label>
        <select name="subject" value={newQuestion.subject} onChange={handleInputChange}>
          <option value="">Choose one...</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Chapter</label>
        <select name="chapter" value={newQuestion.chapter} onChange={handleInputChange}>
          <option value="">Choose one...</option>
          {chapters.map((chapter) => (
            <option key={chapter.chapter_id} value={chapter.chapter_name}>
              {chapter.chapter_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={newQuestion.content}
          onChange={handleInputChange}
          rows="4"
          placeholder="Enter the question content here"
        />
      </div>
      {["A", "B", "C", "D"].map((label, idx) => (
        <div key={idx}>
          <label>Option {label}</label>
          <input
            type="text"
            value={newQuestion.options[idx]}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            placeholder={`Enter Option ${label}`}
          />
        </div>
      ))}
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
        <button onClick={handleAddOrEditQuestion} disabled={loading}>
          {loading
            ? "Saving..."
            : editingQuestion
            ? "Update Question"
            : "Create Question"}
        </button>
      </div>
    </div>
  );
};

export default CreateQuestion;
