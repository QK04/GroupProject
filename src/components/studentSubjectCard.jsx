import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentSubjectCard.css";
import { Link } from "react-router-dom";

function StudentSubjectCard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access_token : null;

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
      const formattedSubjects = subjects.map((subject) => ({
        id: subject.subject_id,
        title: subject.subject_name,
      }));
      setCards(formattedSubjects);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setLoading(false);
    }
  };

  // Fetch subjects from the API on component mount
  useEffect(() => {
    fetchSubjects();
  }, [token]);

  if (loading) {
    return <p>Loading subjects...</p>;
  }

  return (
    <div className="student-card-container">
      {cards.map((card) => (
        <Link key={card.id || card.title} to={`/subject/${card.id}`} style={{ textDecoration: 'none' }}>
          <div className="student-subject-card">
            <div className="student-card-theme">
              <p className="student-card-title">{card.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default StudentSubjectCard;
