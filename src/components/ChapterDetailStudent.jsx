import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChapterDetail.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function ChapterDetailStudent() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const { chapterId } = useParams();
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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

  const fetchQuizData = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setAnswers({});
    setShowFeedback(false);
    setCurrentQuestionIndex(0);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/chapter/${chapterId}/exercise`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const parsedData = JSON.parse(response.data.body);
      const questionsArray = parsedData.questions.map((question) => ({
        ...question,
        questionId: question.quiz_id,
        options: question.choices.map((choice) => ({
          optionId: choice.choice_id,
          text: choice.choice_text,
          isCorrect: choice.is_correct,
        })),
      }));

      if (questionsArray.length > 0) {
        setQuestions(questionsArray);
      } else {
        throw new Error("No questions found in the data");
      }
    } catch (err) {
      setQuizError(err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setShowCorrectAnswer(false);
    } else {
      alert("End of Quiz");
    }
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
    setShowCorrectAnswer(true);
    setTimeout(() => {
      if (showCorrectAnswer) {
        handleNextQuestion();
      }
    }, 2000);
  };

  useEffect(() => {
    fetchChapterDetail();
    fetchQuizData();
  }, [chapterId, token]);

  return (
    <div className="chapterdetail-page">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content-wrapper">
        <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        {/* Conditionally render the content based on loading and error states */}
        {loading ? (
          <div className="loading-container">
            <p>Loading chapter details...</p>
          </div>
        ) : quizError ? (
          <div className="error-container">
            <p>Error: {quizError}</p>
          </div>
        ) : chapter ? (
          <div className="chapterDetail-container">
            <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>

            <div className="chapterDetail-editorContainer">
              <div
                className="chapterDetail-content"
                dangerouslySetInnerHTML={{ __html: chapter.theory_content }}
              />

              <div className="quiz-section">
                {quizLoading ? (
                  <p>Loading quiz...</p>
                ) : questions.length > 0 ? (
                  <div>
                    <h3>Quiz</h3>
                    <h2>{questions[currentQuestionIndex].question_text}</h2>
                    <div className="options">
                      {questions[currentQuestionIndex].options.map((option) => {
                        const isCorrect = option.isCorrect;
                        const isSelected =
                          answers[questions[currentQuestionIndex].questionId] ===
                          option.optionId;
                        const shouldShowFeedback = showCorrectAnswer;

                        return (
                          <label
                            key={option.optionId}
                            className={`option-label ${
                              shouldShowFeedback
                                ? isCorrect
                                  ? "correct"
                                  : isSelected
                                  ? "incorrect"
                                  : ""
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question${currentQuestionIndex}`}
                              value={option.optionId}
                              checked={isSelected}
                              onChange={() =>
                                handleAnswerChange(
                                  questions[currentQuestionIndex].questionId,
                                  option.optionId
                                )
                              }
                              disabled={showCorrectAnswer}
                            />
                            {option.text}
                          </label>
                        );
                      })}
                    </div>
                    {!showCorrectAnswer && (
                      <button onClick={handleSubmitAnswer}>
                        Submit Answer
                      </button>
                    )}
                    {showCorrectAnswer && (
                      <button onClick={handleNextQuestion}>
                        Next Question
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="not-found-container">
            <p>Chapter not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterDetailStudent;