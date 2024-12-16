import React, { useState, useEffect } from "react";
import axios from '../api/axios'; 
import './Ranking.css';

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Payload cho yêu cầu POST
  const payload = {
    httpMethod: "POST",
  };
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access_token : null;
  // Fetch rankings
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/ranking`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Parse JSON từ body
        const parsedBody = JSON.parse(response.data.body);



        if (Array.isArray(parsedBody.ranking)) {
          const sortedData = parsedBody.ranking.sort((a, b) => b.total_points - a.total_points);
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

  return (
    <div className="ranking-container">
      <h1 className="ranking-title">Leaderboard</h1>
      <div className="ranking-table">
        <div className="ranking-header">
          <span className="header-rank">Rank</span>
          <span className="header-name">Name</span>
          <span className="header-points">Points</span>
        </div>
        {rankings.map((ranking, index) => (
          <div className="ranking-row" key={ranking.user_id}>
            <span className="rank">
              {index + 1}{" "}
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
            </span>
            <span className="name">{ranking.user_name}</span>
            <span className="points">{ranking.total_points} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;