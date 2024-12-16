import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import { useParams } from "react-router-dom";
import "./ChapterDetail.css"; // Import the scoped CSS

function ChapterDetail() {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newTheoryContent, setNewTheoryContent] = useState("");
  const quillRef = useRef(null); // Reference for the Quill editor

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
        setNewTheoryContent(body.data.theory_content); // Set initial theory content
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

  const handleSaveTheory = async () => {
    try {
      // Get the content from the Quill editor as HTML
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

      // Update state with the new theory content
      setChapter({ ...chapter, theory_content: quillContent });
      setIsEditing(false); // Exit edit mode
      alert("Chapter theory updated successfully!");
    } catch (error) {
      console.error("Failed to update theory content:", error);
      alert("Failed to update theory. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading chapter details...</p>;
  }

  if (!chapter) {
    return <p>Chapter not found.</p>;
  }

  return (
    <div className="chapterDetail-container">
      <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>

      <div className="chapterDetail-editorContainer">
        {isEditing ? (
          <div>
            {/* Use Quill editor when in editing mode */}
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
            {/* Display the content when not editing */}
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
    </div>
  );
}

export default ChapterDetail;
