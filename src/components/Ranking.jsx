import React,{useState} from "react";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import "./Ranking.css";

const Ranking = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
    const data = [
        { name: "Nguyễn Gia Bách", id: "22b113052", score: 80, rank: 1 },
        { name: "Nguyễn Gia Bách", id: "22b113052", score: 75, rank: 2 },
        { name: "Nguyễn Gia Bách", id: "22b113052", score: 65, rank: 3 },
        { name: "Nguyễn Gia Bách", id: "22b113052", score: 60, rank: 4 },
    ];

    return (
        <div className="page_container">
            <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="ranking_container">
            
            <header className="ranking_header">
                <h2>Leaderboard</h2>
                <nav>
                    <button className="ranking_tab active">Leaderboard</button>
                
                </nav>
            </header>
            <div className="ranking_list">
                {data.map((item, index) => (
                    <div className="ranking_card" key={index}>
                        <div className="ranking_rank">
                                <span className="ranking_position">{item.rank}</span>
                        </div>
                        <div className="ranking_info">
                            <h3 className="ranking_name">{item.name}</h3>
                            <p className="ranking_id">{item.id}</p>
                        </div>
                        <div className="ranking_progress">
                            <div
                                className="ranking_bar"
                                style={{ width: `${item.score}%` }}
                            ></div>
                        </div>
                        <div className="ranking_score">{item.score}%</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
};

export default Ranking;
