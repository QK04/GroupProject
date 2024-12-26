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
  const [isUploading, setIsUploading] = useState(false);
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
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch chapter detail:", error);
        setLoading(false);
      }
    };

    fetchChapterDetail();
  }, [chapterId, token]);

  // Convert YouTube link to Embed URL
  const convertYoutubeLinkToEmbed = (youtubeLink) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeLink.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  // Upload video to S3 and get the URL
  const handleVideoUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", videoFile);
    console.log("Uploading video:", videoFile);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/upload-video?file-name=${encodeURIComponent(videoFile.name)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      console.log("Response:", response);
      const { url } = response.data;
      setYoutubeLink(url); // Set video URL for preview
      alert("Video uploaded successfully!");
      return url; // Trả về URL video để dùng trong logic lưu
    } catch (error) {
      console.error("Failed to upload video:", error);
      alert("Failed to upload video. Please try again.");
      return null; // Trả về null nếu lỗi
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };  

  // Save theory content and video/YouTube link
  const handleSaveTheory = async () => {
    try {
      setIsUploading(true);
  
      const quillContent = quillRef.current.getEditor().root.innerHTML;
      let videoUrlToSave = chapter.video_url;
  
      if (selectedOption === "youtube") {
        videoUrlToSave = convertYoutubeLinkToEmbed(youtubeLink);
        if (!videoUrlToSave) {
          alert("Invalid YouTube link. Please enter a valid link.");
          setIsUploading(false);
          return;
        }
      } else if (selectedOption === "upload" && videoFile) {
        // Tải video và lấy URL
        const uploadedVideoUrl = await handleVideoUpload();
        if (!uploadedVideoUrl) {
          setIsUploading(false);
          return; // Thoát nếu tải video thất bại
        }
        videoUrlToSave = uploadedVideoUrl;
      }
  
      // Lưu lý thuyết và video URL
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}`,
        {
          theory_content: quillContent,
          video_url: videoUrlToSave,
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
      });
  
      setIsEditing(false);
      alert("Chapter updated successfully!");
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
            {chapter.video_url && selectedOption === "youtube" ? (
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
          ) : (
            <video
              width="560"
              height="315"
              controls
              className="chapterDetail-video"
            >
              <source src={chapter.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
