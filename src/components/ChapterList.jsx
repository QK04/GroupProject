import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './ChapterList.css';

function ChapterList() {
  const [chapters, setChapters] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [theoryContent, setTheoryContent] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);  // State để lưu chapter đang chỉnh sửa
  const { subjectId } = useParams();
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access_token : null;

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

  // Handle form submission for creating a new chapter
  const handleCreateChapter = async (e) => {
    e.preventDefault();

    const newChapter = {
      chapter_name: chapterName,
      theory_content: theoryContent,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/subject/${subjectId}`,
        newChapter,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchChapters();
      setShowForm(false);
      setChapterName("");
      setTheoryContent("");
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
  };

  // Handle edit chapter name
  const handleEditChapterName = async (chapterId, newChapterName) => {
    console.log("Editing Chapter ID:", chapterId, "New Chapter Name:", newChapterName);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/name`,
        { chapter_name: newChapterName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchChapters();
      setEditingChapterId(null);  // Close the edit form after successful update
    } catch (error) {
      console.error("Error editing chapter name:", error);
    }
  };

  // Handle delete chapter
  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        fetchChapters();
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [subjectId, token]);

  if (loading) {
    return <p>Loading chapters...</p>;
  }

  if (!chapters.length) {
    return <p>No chapters found for this subject.</p>;
  }

  return (
    <div className="chapterListContainer">
      <h2>Chapters for Subject: {subjectName}</h2>

      {/* Nút Create Chapter */}
      <div className="createChapterContainer">
        <button
          className="createChapterButton"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create Chapter"}
        </button>
      </div>

      {/* Form tạo chapter */}
      {showForm && (
        <div className="createChapterForm">
          <form className="createChapterTable" onSubmit={handleCreateChapter}>
            <div className="formGroup">
              <label htmlFor="chapterName">Chapter Name:</label>
              <input
                type="text"
                id="chapterName"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="theoryContent">Theory Content:</label>
              <ReactQuill
                value={theoryContent}
                onChange={setTheoryContent}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    ["link"],
                    ["blockquote"],
                    [{ align: [] }],
                    ["image"],
                  ],
                }}
                formats={[
                  "header", "font", "list", "bold", "italic", "underline", "link", "blockquote", "image", "align",
                ]}
                required
              />
            </div>
            <button type="submit">Create Chapter</button>
          </form>
        </div>
      )}

      {/* Hiển thị danh sách các chương */}
      <div className="chapterList">
        {chapters.map((chapter) => (
          <div key={chapter.chapter_id} className="chapterCard">
            <h3>
              <Link to={`/chapter/${chapter.chapter_id}`}>{chapter.chapter_name}</Link>
            </h3>
            <div className="chapterCardButton">
            {/* Nút Edit */}
            {editingChapterId === chapter.chapter_id ? (
              <div>
                <input
                  type="text"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  required
                />
                <button
                  onClick={() =>
                    handleEditChapterName(chapter.chapter_id, chapterName)
                  }
                >
                  Save
                </button>
                <button onClick={() => setEditingChapterId(null)}>Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingChapterId(chapter.chapter_id); // Đặt trạng thái chỉnh sửa
                  setChapterName(chapter.chapter_name); // Cập nhật tên chương hiện tại vào state
                }}
              >
                Edit Name
              </button>
            )}

            {/* Nút Delete */}
            <button onClick={() => handleDeleteChapter(chapter.chapter_id)}>
              Delete
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
