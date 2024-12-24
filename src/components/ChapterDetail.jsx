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
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isUploading, setIsUploading] = useState(false); // For loading state
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

      const body = JSON.parse(response.data.body); 
      console.log("Chapter detail response:", body);
      if (body && body.data) {
        setChapter(body.data); // Set the data object from the response
        setNewTheoryContent(body.data.theory_content); // Set initial theory content
        setYoutubeLink(body.data.video_url || ""); // Set initial YouTube link
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chapter detail:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterDetail(); // Fetch chapter details when component mounts
  }, [chapterId]);

  // Convert YouTube link to Embed URL
  const convertYoutubeLinkToEmbed = (youtubeLink) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeLink.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null; // Invalid YouTube link
  };

  const handleSaveTheory = async () => {
    try {
      setIsUploading(true);

      // Get Quill editor content
      const quillContent = quillRef.current.getEditor().root.innerHTML;

      // Validate YouTube link
      let youtubeLinkToSave = null;
      if (video_url) {
        youtubeLinkToSave = convertYoutubeLinkToEmbed(video_url);
        if (!youtubeLinkToSave) {
          alert("Invalid YouTube link. Please enter a valid link.");
          setIsUploading(false);
          return;
        }
      }

      // Save chapter content
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}`,
        {
          theory_content: quillContent,
          youtube_link: youtubeLinkToSave, // Chỉ gửi YouTube link nếu có
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with the new data to refresh UI
      setChapter({
        ...chapter,
        theory_content: quillContent,
        video_url: youtubeLinkToSave,
      });

      setIsEditing(false); // Exit editing mode
      setIsUploading(false); // Stop loading state
      alert("Chapter updated successfully!");
    } catch (error) {
      console.error("Failed to update chapter:", error);
      alert("Failed to update chapter. Please try again.");
      setIsUploading(false);
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
            {/* Quill Editor for theory content */}
            <ReactQuill
              ref={quillRef}
              value={newTheoryContent}
              onChange={setNewTheoryContent}
              theme="snow"
              className="chapterDetail-editor"
            />
            {/* Add YouTube Link */}
            <div className="chapterDetail-youtubeSection">
              <label>YouTube Link:</label>
              <input
                type="text"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="Enter YouTube link"
              />
            </div>
            {/* Buttons */}
            <div className="chapterDetail-buttons">
              <button
                className="chapterDetail-saveButton"
                onClick={handleSaveTheory}
                disabled={isUploading}
              >
                {isUploading ? "Saving..." : "Save"}
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
            {/* Display Theory Content */}
            <div
              className="chapterDetail-content"
              dangerouslySetInnerHTML={{ __html: chapter.theory_content }}
            />

            {/* YouTube Link Preview */}
            {chapter.video_url && (
              <iframe
                width="560"
                height="315"
                src={chapter.video_url} // Embed URL
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="chapterDetail-iframe"
              ></iframe>
            )}
            <button
              className="chapterDetail-editButton"
              onClick={() => setIsEditing(true)}
            >
              Edit Chapter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterDetail;
