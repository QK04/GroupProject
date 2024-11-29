import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubjectCard.css";

function SubjectCard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access_token : null;
  const teacher_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user_id : null;
    
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
        const subjects = JSON.parse(response.data.body).subjects || [];
        console.log("Display: ", subjects);
        const formattedSubjects = subjects.map((subjects) => ({
          id: subjects.subject_id, // Generate an ID based on index
          title: subjects.subject_name,
        }));
        setCards(formattedSubjects); // Assume API returns an array of subjects
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setLoading(false);
      }  
    }
  // Fetch subjects from the API on component mount
  useEffect(() => {
    fetchSubjects();
  }, [token]);

  // Add a new subject
  const handleAddCard = async () => {
    try {

      const subject_name = prompt("Enter the subject name:");
      if (!subject_name) {
        alert("Subject name is required!");
        return;
      }

      const newSubject = {
        subject_name,
        subject_description: "Default description",
        teacher_id,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/subject`,
        newSubject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const addedSubject = response.data;
      setCards([...cards, { 
        id: addedSubject.subject_id, 
        title: addedSubject.subject_name }]);
      await fetchSubjects();
    } catch (error) {
      console.error("Failed to add new subject:", error);
    }
  };

  // Delete a subject
  const handleDeleteCard = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");
    if (confirmDelete) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/subject/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setCards(cards.filter((card) => card.id !== id)); // Remove card from state
      } catch (error) {
        console.error("Failed to delete subject:", error);
      }
    }
  };

  // Edit a subject
  const handleEditCard = async (id) => {
    const newTitle = prompt("Enter a new title for the card:");
    if (newTitle) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/subject/${id}`,
          { subject_name: newTitle },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setCards(
          cards.map((card) =>
            card.id === id ? { ...card, title: response.data.subject_name || newTitle } : card
          )
        );
        alert("Subject updated successfully!");
      } catch (error) {
        console.error("Failed to edit subject:", error);
        alert("Failed to update subject. Please try again.");
      }
    }
  };

  if (loading) {
    return <p>Loading subjects...</p>;
  }

  return (
    <div className="cardContainer">
      {cards.map((card) => (
        <div key={card.id || card.title} className="subjectCard">
          <img
            src="src/assets/more.png"
            alt="Options"
            className="moreCardImageButton"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="cardTheme">
            <p className="title">{card.title}</p>
          </div>
          <button onClick={() => handleEditCard(card.id)}>Edit</button>
          <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
        </div>
      ))}
      <button className="addCardButton" onClick={handleAddCard}>
        Add New Card
      </button>
    </div>
  );
}

export default SubjectCard;
