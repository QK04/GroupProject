import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import "./ChapterDetail.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./teacherSidebar";

function ChapterDetail() {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [isEditing, setIsEditing] = useState(false);
  const [newTheoryContent, setNewTheoryContent] = useState("");
  const quillRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { chapterId } = useParams();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  const fetchChapterDetail = async () => {
    setLoading(true);
    setError(null); // Reset error state
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

      const body = JSON.parse(response.data.body);
      if (body && body.data) {
        setChapter(body.data);
        setNewTheoryContent(body.data.theory_content);
      }
    } catch (error) {
      console.error("Failed to fetch chapter detail:", error);
      setError(error); // Set error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterDetail();
  }, [chapterId, token]);

  const handleSaveTheory = async () => {
    try {
      const quillContent = quillRef.current.getEditor().root.innerHTML;

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}`,
        { theory_content: quillContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setChapter({ ...chapter, theory_content: quillContent });
      setIsEditing(false);
      alert("Chapter theory updated successfully!");
    } catch (error) {
      console.error("Failed to update theory content:", error);
      alert("Failed to update theory. Please try again.");
    }
  };

  return (
    <div className="chapterDetail-teacher-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="chapterDetail-container">
        {loading ? (
          <p>Loading chapter details...</p>
        ) : error ? (
          <p>Error loading chapter details: {error.message}</p>
        ) : chapter ? (
          <>
            <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>
            <div className="chapterDetail-editorContainer">
              {isEditing ? (
                <div>
                  <ReactQuill
                    ref={quillRef}
                    value={newTheoryContent}
                    onChange={setNewTheoryContent}
                    theme="snow"
                    className="chapterDetail-editor"
                  />
                  <div className="chapterDetail-buttons">
                    <button
                      className="chapterDetail-saveButton"
                      onClick={handleSaveTheory}
                    >
                      Save
                    </button>
                    <button
                      className="chapterDetail-cancelButton"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="chapterDetail-content"
                    dangerouslySetInnerHTML={{ __html: chapter.theory_content }}
                  />
                  <button
                    className="chapterDetail-editButton"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Theory
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Chapter not found.</p>
        )}
      </div>
    </div>
  );
}

export default ChapterDetail;