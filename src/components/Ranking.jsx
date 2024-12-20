import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./Ranking.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  // Fetch rankings
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const payload = { httpMethod: "POST" };
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/ranking`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const parsedBody = JSON.parse(response.data.body);
        if (Array.isArray(parsedBody.ranking)) {
          const sortedData = parsedBody.ranking.sort(
            (a, b) => b.total_points - a.total_points
          );
          setRankings(sortedData);
        } else {
          console.error("Unexpected data structure:", parsedBody);
          setError("Invalid response format from API.");
        }
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Split top 3 and others
  const top3 = rankings.slice(0, 3);
  const others = rankings.slice(3);

  return (
    <div>
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    

    <div className="ranking-container">
      <h1 className="ranking-title">Leaderboard</h1>

      {/* Top 3 Section */}
      <div className="top-3-container">
      <div className="top-card top-2">
        <div className="top-rank">🥈</div>
        <div className="top-info">
          <h2 className="top-name">{top3[1]?.user_name}</h2>
          <p className="top-points">{top3[1]?.total_points} points</p>
        </div>
      </div>
      <div className="top-card top-1">
        <div className="top-rank">🥇</div>
        <div className="top-info">
          <h2 className="top-name">{top3[0]?.user_name}</h2>
          <p className="top-points">{top3[0]?.total_points} points</p>
        </div>
      </div>
      <div className="top-card top-3">
        <div className="top-rank">🥉</div>
        <div className="top-info">
          <h2 className="top-name">{top3[2]?.user_name}</h2>
          <p className="top-points">{top3[2]?.total_points} points</p>
        </div>
      </div>
    </div>

      {/* Other Rankings */}
      <div className="ranking-table">
        <div className="ranking-header">
          <span className="header-rank">Rank</span>
          <span className="header-name">Name</span>
          <span className="header-points">Points</span>
        </div>
        {others.map((ranking, index) => (
          <div className="ranking-row" key={ranking.user_id}>
            <span className="rank">{index + 4}</span>
            <span className="name">{ranking.user_name}</span>
            <span className="points">{ranking.total_points} points</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Ranking;
