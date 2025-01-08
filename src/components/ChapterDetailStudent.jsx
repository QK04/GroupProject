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
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
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

  const fetchQuizData = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setAnswers({});
    setShowCorrectAnswer(false);
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
        questionId: question.quiz_id, // Use quiz_id as questionId
        options: question.choices.map((choice) => ({
          optionId: choice.choice_id, // Use choice_id as optionId
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
      setShowCorrectAnswer(false);
      setSubmissionResult(null); // Reset submission feedback for next question
    } else {
      console.log("End of Quiz");
    }
  };

  const handleSubmitAnswer = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser ? currentUser.user_id : null;

    if (!userId) {
      console.error("User ID not found. User might not be logged in.");
      setSubmissionResult({ error: "User ID not found." });
      return;
    }

    // Build the answer data for the POST request
    const answerData = {
      user_id: userId,
      answers: Object.entries(answers).map(([question_id, submitted_answer]) => ({
        question_id,
        submitted_answer: submitted_answer.toString(),
      })),
    };

    // Log the answer data for debugging
    console.log("Submitting answer data:", answerData);

    try {
      // Send the POST request to the API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chapter/${chapterId}/exercise`,
        answerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response from the API
      console.log("API Response:", response);

      // Parse the response body as JSON
      const responseData = response.data; 

      // Assuming the API returns an object with an 'answers' array, 
      // where each answer object includes 'question_id' and 'is_correct'
      if (responseData && responseData.body) {
        const parsedBody = JSON.parse(responseData.body);
        if (parsedBody.answers && Array.isArray(parsedBody.answers)) {
          // Update submissionResult with correctness information
          setSubmissionResult({ answers: parsedBody.answers });

          // Show the correct answers
          setShowCorrectAnswer(true);
        } else {
          // Handle unexpected response format
          console.error("Invalid response format: 'answers' array not found.");
          setSubmissionResult({ error: "Invalid response format from API." });
        }
      } else {
        // Handle unexpected response format
        console.error("Invalid response format: responseData or responseData.body is null.");
        setSubmissionResult({ error: "Invalid response format from API." });
      }
    } catch (error) {
      // Handle errors during the API request
      console.error("Error submitting answers:", error);
      setSubmissionResult({
        error: "Failed to submit answers: " + error.message,
      });
    }
  };

  useEffect(() => {
    fetchChapterDetail();
    fetchQuizData();
  }, [chapterId, token]);

  const handleDownload = () => {
    if (chapter) {
      const doc = new jsPDF();
      const pageHeight = 297; // A4 page height (mm)
      const marginTop = 10;
      const marginBottom = 10;
      const maxHeight = pageHeight - marginTop - marginBottom;
      const lineHeight = 5;
      let y = marginTop;

      const plainTextContent = htmlToText(chapter.theory_content, {
        wordwrap: 130,
      });

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
        ) : quizError ? (
          <div className="error-container">
            <p>Error: {quizError}</p>
          </div>
        ) : chapter ? (
          <>
            <div className="chapterDetail-container">
              <h2 className="chapterDetail-title">{chapter.chapter_name}</h2>
              <div className="chapterDetail-editorContainer">
                <div className="chapterDetail-content">
                  <div
                    dangerouslySetInnerHTML={{ __html: chapter.theory_content }}
                  />
                </div>
                <div className="chapterDetail-mediaContainer">
                  {chapter.video_url && (
                    <iframe
                      src={chapter.video_url}
                      title="Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="chapterDetail-iframe"
                    ></iframe>
                  )}
                  {chapter.image_url && (
                    <img
                      src={chapter.image_url}
                      alt="Chapter"
                      className="chapterDetail-image"
                    />
                  )}
                  <button className="download-button" onClick={handleDownload}>
                    Download Chapter
                  </button>
                </div>
              </div>
            </div>
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

                      // Determine if the option should be highlighted as correct or incorrect
                      const shouldShowCorrect = showCorrectAnswer && isCorrect;
                      const shouldShowIncorrect =
                        showCorrectAnswer && isSelected && !isCorrect;

                      return (
                        <label
                          key={option.optionId}
                          className={`option-label ${
                            shouldShowCorrect ? "correct" : ""
                          } ${shouldShowIncorrect ? "incorrect" : ""}`}
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

                  {/* Submit and Next Question Buttons */}
                  {!showCorrectAnswer && (
                    <button
                      className="download-button"
                      onClick={handleSubmitAnswer}
                    >
                      Submit Answer
                    </button>
                  )}

                  {showCorrectAnswer && (
                    <>
                      <button
                        className="download-button"
                        onClick={handleNextQuestion}
                      >
                        Next Question
                      </button>

                      {/* Display feedback for each answer */}
                      {submissionResult && (
                        <div className="submission-feedback">
                          {submissionResult.error ? (
                            <p className="error-message">
                              {submissionResult.error}
                            </p>
                          ) : (
                            <div>
                              {submissionResult.answers &&
                                submissionResult.answers.map((answerResult) => {
                                  // Find the submitted answer for this question
                                  const submittedAnswer = answers[answerResult.question_id];

                                  // Find the option text for both the correct and submitted answers
                                  const question = questions.find(q => q.questionId === answerResult.question_id);
                                  const correctAnswerText = question?.options.find(o => o.isCorrect)?.text;
                                  const submittedAnswerText = question?.options.find(o => o.optionId.toString() === submittedAnswer)?.text;

                                  return (
                                    <div key={answerResult.question_id}>
                                      <p className={answerResult.is_correct ? "correct-message" : "incorrect-message"}>
                                      
                                        {answerResult.is_correct ? "Correct" : `Incorrect`}
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : null}
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