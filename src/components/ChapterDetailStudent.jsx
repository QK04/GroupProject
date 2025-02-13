import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChapterDetail.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { htmlToText } from "html-to-text";

function ChapterDetailStudent() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const { chapterId } = useParams();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

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
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chapter detail:", error);
      setLoading(false);
    }
  };

  const fetchQuizQuestion = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setSubmissionResult(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/quiz`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const parsedData = JSON.parse(response.data.body);
      console.log("Fetched Quiz Question:", parsedData);

      if (!parsedData.quiz_id) {
        throw new Error("Quiz ID is missing in the fetched question");
      }

      setQuestion(parsedData);
    } catch (err) {
      console.error("Failed to fetch quiz question:", err);
      setQuizError(err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerChange = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
  };

  const handleSubmitAnswer = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser ? currentUser.user_id : null;

    if (!userId) {
      console.error("User ID not found. User might not be logged in.");
      setSubmissionResult({ error: "User ID not found." });
      return;
    }

    if (!userAnswer) {
      console.error("No answer selected.");
      setSubmissionResult({ error: "Please select an answer before submitting." });
      return;
    }

    if (!question || !question.quiz_id) {
      console.error("Quiz ID is missing. Cannot submit answer.");
      setSubmissionResult({ error: "Quiz question is not properly loaded." });
      return;
    }

    const answerData = {
      user_id: userId,
      chapter_id: chapterId,
      quiz_id: question.quiz_id,
      answer: userAnswer,
    };

    console.log("Submitting Answer Data:", answerData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/quiz`,
        answerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      console.log("Quiz Submission Response:", responseData);

      const parsedBody = JSON.parse(responseData.body);
      console.log("Parsed Quiz Submission Response:", parsedBody);

      setSubmissionResult(parsedBody);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setSubmissionResult({ error: "Failed to submit answer." });
    }
  };

  useEffect(() => {
    fetchChapterDetail();
    fetchQuizQuestion();
  }, [chapterId, token]);

  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    let videoId = "";

    if (url.includes("m.youtube.com")) {
      url = url.replace("m.youtube.com", "www.youtube.com");
    }

    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    if (match && match[1]) {
      videoId = match[1];
    } else {
      return url;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleDownload = () => {
    if (chapter) {
      const doc = new jsPDF();
      const pageHeight = 297;
      const marginTop = 10;
      const marginBottom = 10;
      const maxHeight = pageHeight - marginTop - marginBottom;
      const lineHeight = 5;
      let y = marginTop;

      const plainTextContent = htmlToText(chapter.theory_content, { wordwrap: 130 });
      const lines = doc.splitTextToSize(plainTextContent, 180);

      doc.setFontSize(18);
      doc.text(chapter.chapter_name, 10, y);
      y += 15;

      doc.setFontSize(12);
      lines.forEach((line) => {
        if (y + lineHeight > maxHeight) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(line, 10, y);
        y += lineHeight;
      });

      doc.save(`${chapter.chapter_name}.pdf`);
    }
  };

  return (
    <div className="chapterdetail-page">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content-wrapper">
        <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        {loading ? (
          <div className="loading-container">
            <p>Loading chapter details...</p>
          </div>
        ) : chapter ? (
          <>
            <div className="chapterDetail-container">
              <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>
              <div className="chapterDetail-editorContainer">
                <div className="chapterDetail-content">
                  <div dangerouslySetInnerHTML={{ __html: chapter.theory_content }} />
                </div>
                <div className="chapterDetail-mediaContainer">
                  {chapter.video_url && (
                    <iframe
                      src={convertToEmbedUrl(chapter.video_url)}
                      title="Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="chapterDetail-iframe"
                    ></iframe>
                  )}
                  {chapter.image_url && <img src={chapter.image_url} alt="Chapter" className="chapterDetail-image" />}
                  <button className="download-button" onClick={handleDownload}>
                    Download Chapter
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="error-container">
            <p>Chapter not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterDetailStudent;
