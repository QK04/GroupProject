import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <Link to="/multiple-choice">
        <button>Take Test</button>
      </Link>
      <Link to="/quiz">
        <button>Start Quiz</button>
      </Link>
    </div>
  );
};

export default StudentDashboard;
