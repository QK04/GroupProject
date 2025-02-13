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
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTheoryContent, setNewTheoryContent] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState("youtube");
  const quillRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { chapterId } = useParams();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  useEffect(() => {
    const fetchChapterDetail = async () => {
      setLoading(true);
      setError(null);
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
        console.log(body);
        if (body && body.data) {
          setChapter(body.data);
          setNewTheoryContent(body.data.theory_content);
          setYoutubeLink(body.data.video_url || "");
          setImageUrl(body.data.image_url || "");
        } else {
          setError(new Error("Chapter data not found"));
        }
      } catch (error) {
        console.error("Failed to fetch chapter detail:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterDetail();
  }, [chapterId, token]);

  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    let videoId = "";

    // Convert mobile YouTube URL to standard
    if (url.includes("m.youtube.com")) {
      url = url.replace("m.youtube.com", "www.youtube.com");
    }

    // Extract video ID from YouTube URLs
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    if (match && match[1]) {
      videoId = match[1];
    } else {
      return url; // Return original URL if it doesn't match
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleSaveTheory = async () => {
    try {
      setIsUploading(true);

      const quillContent = quillRef.current.getEditor().root.innerHTML;
      let videoUrlToSave = chapter.video_url;

      if (selectedOption === "youtube") {
        videoUrlToSave = youtubeLink;
      } else if (selectedOption === "upload" && videoFile) {
        const formData = new FormData();
        formData.append("file", videoFile);
        const videoResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/upload-video`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        videoUrlToSave = videoResponse.data.url;
      }

      let imageUrlToSave = imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imageResponse = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/upload-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrlToSave = imageResponse.data.imageUrl;
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}`,
        {
          theory_content: quillContent,
          video_url: videoUrlToSave,
          image_url: imageUrlToSave,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setChapter({
        ...chapter,
        theory_content: quillContent,
        video_url: videoUrlToSave,
        image_url: imageUrlToSave,
      });

      setIsEditing(false);
      alert("Chapter updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update chapter:", error);
      alert("Failed to update chapter. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="chapterDetail-teacher-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="teacher-chapterDetail-container">
        {loading ? (
          <p>Loading chapter details...</p>
        ) : error ? (
          <p>Error loading chapter details: {error.message}</p>
        ) : chapter ? (
          <>
            <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>

            <div className="chapterDetail-editorContainer">
              <div className="chapterDetail-content">
                {isEditing ? (
                  <ReactQuill
                    ref={quillRef}
                    value={newTheoryContent}
                    onChange={setNewTheoryContent}
                    theme="snow"
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: chapter.theory_content }} />
                )}
              </div>

              <div className="chapterDetail-mediaContainer">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      placeholder="Enter YouTube link"
                    />
                  </div>
                ) : (
                  chapter.video_url && (
                    <iframe
                      src={convertToEmbedUrl(chapter.video_url)}
                      title="Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="chapterDetail-iframe"
                    ></iframe>
                  )
                )}

                {imageUrl && <img src={imageUrl} alt="Chapter" className="chapterDetail-image" />}
                <div className="chapterDetail-buttons">
                  {isEditing ? (
                    <>
                      <button className="edit" onClick={handleSaveTheory} disabled={isUploading}>
                        {isUploading ? "Saving..." : "Save"}
                      </button>
                      <button className="edit" onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                  ) : (
                    <button className="edit" onClick={() => setIsEditing(true)}>Edit Chapter</button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ChapterDetail;
