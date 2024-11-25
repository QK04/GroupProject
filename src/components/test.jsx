import React, { useState, useEffect } from "react";
import './test.css';

const MultipleChoiceLayout = () => {
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Câu hỏi hiện tại
  const [answers, setAnswers] = useState({}); // Đáp án người dùng đã chọn

  // Hàm giả lập lấy dữ liệu từ API
  useEffect(() => {
    const fetchQuestions = async () => {
      const mockData = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}: What is your answer?`,
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      }));
      setQuestions(mockData);
    };

    fetchQuestions();
  }, []);

  // Hàm xử lý chọn đáp án
  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Hàm chuyển sang câu hỏi trước hoặc sau
  const handleNavigation = (direction) => {
    setCurrentQuestionIndex((prev) =>
      direction === "next"
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  // Hàm gửi câu trả lời
  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Your answers have been submitted!");
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Multiple Choice Layout</title>
      <link rel="stylesheet" href="test.css" />
      <div className="container">
        {/* Test selection section */}
        <div className="test-selection">
          <h3>Test Number 1:</h3>
          {Array.from({ length: 15 }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestionIndex(i)}
              className={currentQuestionIndex === i ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <br />
          <button className="finish" onClick={handleSubmit}>
            Finished? Then Submit
          </button>
        </div>

        {/* Question section */}
        <div className="question-section">
          {questions.length > 0 && (
            <>
              <label>
                <h2>{questions[currentQuestionIndex].text}</h2>
              </label>
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`question${questions[currentQuestionIndex].id}`}
                    value={option}
                    checked={
                      answers[questions[currentQuestionIndex].id] === option
                    }
                    onChange={() =>
                      handleAnswerChange(
                        questions[currentQuestionIndex].id,
                        option
                      )
                    }
                  />
                  {option}
                </label>
              ))}
              <div className="button-container">
                <button onClick={() => handleNavigation("prev")}>
                  Previous
                </button>
                <button onClick={() => handleNavigation("next")}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MultipleChoiceLayout;
