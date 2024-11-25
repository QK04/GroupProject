import React, { useState, useEffect } from "react";
import './quiz.css';

const QuizPage = () => {
  // State để lưu trữ danh sách câu hỏi
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const questionsPerPage = 8; // Số lượng câu hỏi mỗi trang

  // Hàm giả lập lấy dữ liệu từ API
  useEffect(() => {
    // Dữ liệu mẫu
    const fetchQuestions = async () => {
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        correctRate: Math.random() * 100, // Tỉ lệ đúng ngẫu nhiên
        errorRate: Math.random() * 100, // Tỉ lệ sai ngẫu nhiên
      }));
      setQuestions(mockData);
    };

    fetchQuestions();
  }, []);

  // Lấy câu hỏi cho trang hiện tại
  const displayedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container">
        {displayedQuestions.map((question) => (
          <button key={question.id} className="card">
            <div className="number red-text">{question.id}</div>
            <div className="bottom-right">
              <div className="label orange-text">
                <span>{question.errorRate.toFixed(0)}%</span>
                <img src="img/error.png" alt="error-icon" />
              </div>
            </div>
            <div className="bottom-left">
              <div className="label green-text">
                <img src="img/correct.png" alt="correct-icon" />
                <span>{question.correctRate.toFixed(0)}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="pagination">
        <a
          href="#"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        >
          «
        </a>
        {Array.from(
          { length: Math.ceil(questions.length / questionsPerPage) },
          (_, i) => (
            <a
              key={i}
              href="#"
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </a>
          )
        )}
        <a
          href="#"
          onClick={() =>
            handlePageChange(
              Math.min(
                currentPage + 1,
                Math.ceil(questions.length / questionsPerPage)
              )
            )
          }
        >
          »
        </a>
      </div>
    </>
  );
};

export default QuizPage;
