import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import "./ChapterDetail.css";

function ChapterDetail() {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newTheoryContent, setNewTheoryContent] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // State for storing image URL
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState("youtube");
  const quillRef = useRef(null);

  const { chapterId } = useParams();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  // Fetch chapter details
  useEffect(() => {
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
        if (body && body.data) {
          setChapter(body.data);
          setNewTheoryContent(body.data.theory_content);
          setYoutubeLink(body.data.video_url || "");
          setImageUrl(body.data.image_url || ""); // Fetch image URL
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch chapter detail:", error);
        setLoading(false);
      }
    };

    fetchChapterDetail();
  }, [chapterId, token]);

  // Convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  // Handle save functionality
  const handleSaveTheory = async () => {
    try {
      setIsUploading(true);

      // Prepare content to save
      const quillContent = quillRef.current.getEditor().root.innerHTML;
      let videoUrlToSave = chapter.video_url;

      // Handle video upload
      if (selectedOption === "youtube") {
        videoUrlToSave = youtubeLink;
      } else if (selectedOption === "upload" && videoFile) {
        const base64Video = await toBase64(videoFile);
        const videoResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/upload-video`,
          {
            file: base64Video,
            fileName: videoFile.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        videoUrlToSave = videoResponse.data.url;
      }

      // Handle image upload
      let imageUrlToSave = imageUrl;
      if (imageFile) {
        const base64Image = await toBase64(imageFile);
        const imageResponse = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/upload-image`,
          {
            imageBase64: base64Image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        imageUrlToSave = imageResponse.data.imageUrl;
      }

      // Save theory content, video, and image URL
      const response = await axios.put(
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

  if (loading) return <p>Loading chapter details...</p>;
  if (!chapter) return <p>Chapter not found.</p>;

  return (
    <div className="chapterDetail-container">
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
            <div className="chapterDetail-optionSection">
              <label>Video Option:</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="youtube">YouTube Link</option>
                <option value="upload">Upload Video</option>
              </select>
            </div>
            {selectedOption === "youtube" ? (
              <div className="chapterDetail-youtubeSection">
                <label>YouTube Link:</label>
                <input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="Enter YouTube link"
                />
              </div>
            ) : (
              <div className="chapterDetail-uploadSection">
                <label>Upload Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
                {isUploading && <p>Uploading: {uploadProgress}%</p>}
              </div>
            )}
            <div className="chapterDetail-imageSection">
              <label>Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <div className="chapterDetail-buttons">
              <button
                className="chapterDetail-saveButton"
                onClick={handleSaveTheory}
                disabled={isUploading || uploadProgress > 0}
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
            <div
              className="chapterDetail-content"
              dangerouslySetInnerHTML={{ __html: chapter.theory_content }}
            />
            {chapter.video_url && (
              <iframe
                width="560"
                height="315"
                src={chapter.video_url}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="chapterDetail-iframe"
              ></iframe>
            )}
            {imageUrl && <img src={imageUrl} alt="Chapter" className="chapterDetail-image" />}
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
