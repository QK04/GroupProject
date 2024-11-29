import React, { useState, useEffect, useRef } from "react";
import "./SubjectCard.css";

function SubjectCard() {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Advanced Programming with Python",
    },
  ]);
  const [activeCardId, setActiveCardId] = useState(null); // Track which card's dropdown is open

  const dropdownRef = useRef(null); // Reference to the dropdown menu

  // Function to add a new card
  const handleAddCard = () => {
    const newCard = {
      id: cards.length + 1,
      title: `New Subject Card ${cards.length + 1}`,
    };
    setCards([...cards, newCard]);
  };

  // Function to handle delete action
  const handleDeleteCard = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");
    if (confirmDelete) {
      const updatedCards = cards.filter((card) => card.id !== id);
      setCards(updatedCards);
    }
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  // Function to handle edit action
  const handleEditCard = (id) => {
    const newTitle = prompt("Enter a new title for the card:");
    if (newTitle) {
      setCards(
        cards.map((card) => (card.id === id ? { ...card, title: newTitle } : card))
      );
    }
    setActiveCardId(null); // Close the dropdown after editing
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveCardId(null); // Close dropdown if clicked outside
      }
    };

    // Add the event listener to document
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="cardContainer">
      {cards.map((card) => (
        <div
          key={card.id}
          className="subjectCard"
          onClick={(e) => e.stopPropagation()} // Prevent click on card from closing the dropdown
        >
          {/* More icon to toggle the dropdown */}
          <img
            src="src\assets\more.png"
            alt="Options"
            className="moreCardImageButton"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from propagating to the card
              toggleDropdown(card.id);
            }}
          />

          {/* Conditional rendering of dropdown */}
          {activeCardId === card.id && (
            <div
              ref={dropdownRef} // Reference to the dropdown menu
              className="dropdownMenu"
            >
              <button onClick={() => handleEditCard(card.id)}>Edit</button>
              <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
            </div>
          )}

          <div className="cardTheme">
            <p className="title">{card.title}</p>
          </div>
        </div>
      ))}
      <button className="addCardButton" onClick={handleAddCard}>
        Add New Card
      </button>
    </div>
  );
}

export default SubjectCard;
