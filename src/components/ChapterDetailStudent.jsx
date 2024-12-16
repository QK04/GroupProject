import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChapterDetail.css"; 
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function ChapterDetailStudent() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };
    
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  const { chapterId } = useParams(); // Get chapterId from URL
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Fetch chapter detail when the component mounts
  const fetchChapterDetail = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const body = JSON.parse(response.data.body); // Parse the body field
      if (body && body.data) {
        setChapter(body.data); // Set the data object from the response
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chapter detail:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterDetail(); // Fetch chapter details when component mounts
  }, [chapterId, token]);

  if (loading) {
    return <p>Loading chapter details...</p>;
  }

  if (!chapter) {
    return <p>Chapter not found.</p>;
  }

  return (
    <div className="chapterDetail-container">
        <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>

      <div className="chapterDetail-editorContainer">
        {/* Display the content for students */}
        <div
          className="chapterDetail-content"
          dangerouslySetInnerHTML={{ __html: chapter.theory_content }}
        />
      </div>
    </div>
  );
}

export default ChapterDetailStudent;
