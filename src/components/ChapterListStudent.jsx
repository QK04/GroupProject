import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ChapterListStudent.css";
import { useNavigate } from "react-router-dom";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";

function StudentChapterList() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const [chapters, setChapters] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const { subjectId } = useParams();
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access_token : null;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch chapters for the given subjectId
  const fetchChapters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/subject/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const body = JSON.parse(response.data.body);
      if (Array.isArray(body)) {
        setChapters(body);
        setSubjectName(body[0]?.subject_name || "");
      } else {
        setChapters([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [subjectId, token]);

  return (
    <>
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      <div className="student-chapter-content">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="student-chapter-list-container">
          {loading ? (
            <p>Loading chapters...</p>
          ) : chapters.length > 0 ? (
            <>
              <h2>Chapters for Subject: {subjectName}</h2>
              <div className="student-chapter-list">
                {chapters.map((chapter) => (
                  <div key={chapter.chapter_id} className="student-chapter-card">
                    <h3>
                      <Link to={`/chapter/${chapter.chapter_id}`}>{chapter.chapter_name}</Link>
                    </h3>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2>Chapters for Subject: {subjectName}</h2>
              <p>No chapters found for this subject.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentChapterList;