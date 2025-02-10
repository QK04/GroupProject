import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChapterDetail.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { htmlToText } from "html-to-text"; // Import thư viện html-to-text

function ChapterDetailStudent() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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

  const handleDownload = () => {
    if (chapter) {
      const doc = new jsPDF();
      const pageHeight = 297; // Chiều cao trang A4 (mm)
      const marginTop = 10; // Lề trên
      const marginBottom = 10; // Lề dưới
      const maxHeight = pageHeight - marginTop - marginBottom; // Chiều cao nội dung
      const lineHeight = 5; // Khoảng cách giữa các dòng
      let y = marginTop; // Vị trí dòng hiện tại
  
      // Chuyển đổi nội dung HTML thành văn bản thuần
      const plainTextContent = htmlToText(chapter.theory_content, {
        wordwrap: 130, // Độ dài dòng tối đa
      });
  
      // Chia nội dung thành các dòng
      const lines = doc.splitTextToSize(plainTextContent, 180); // 180 là chiều rộng nội dung
  
      // Thêm tiêu đề chương
      doc.setFontSize(18);
      doc.text(chapter.chapter_name, 10, y);
      y += 15; // Dịch xuống sau tiêu đề
  
      // Thêm nội dung từng dòng và kiểm tra chiều cao trang
      doc.setFontSize(12);
      lines.forEach((line) => {
        if (y + lineHeight > maxHeight) {
          doc.addPage(); // Thêm trang mới nếu vượt quá chiều cao
          y = marginTop; // Reset vị trí dòng
        }
        doc.text(line, 10, y);
        y += lineHeight; // Dịch xuống dòng tiếp theo
      });
  
      // Lưu tệp PDF
      doc.save(`${chapter.chapter_name}.pdf`);
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

      {/* Download button */}
      <button className="download-button" onClick={handleDownload}>
        Download Chapter
      </button>
    </div>
  );
}

export default ChapterDetailStudent;
