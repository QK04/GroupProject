import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import addChatIcon from '../assets/add_note.png';
import awardIcon from '../assets/award.png';
import logoutIcon from '../assets/logout.png';
import quizIcon from '../assets/quiz.png';
import settingIcon from '../assets/settings.png';
import usthLogo from '../assets/usthlogo.png';
import profileIcon from '../assets/profile.png';
import theoryIcon from '../assets/theory.png';
import Setting from './SidebarItem/Setting';
import axios from 'axios';

export default function Sidebar({ isOpen }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access_token : null;

  const mainMenuItems = [
    { text: 'Chat Bot', icon: addChatIcon, path: '/student-dashboard' },
    { text: 'Subjects', icon: theoryIcon, path: '/subject', dropdown: true },
    { text: 'Tests', icon: quizIcon, path: '/quiz' },
    { text: 'Rankings', icon: awardIcon, path: '/Ranking' },
    { text: 'User', icon: profileIcon, path: '/user_profile' },
    { text: 'Setting', icon: settingIcon, path: '/Setting' },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/subject`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const subjectsData = JSON.parse(response.data.body).subjects || [];
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [token]);

  useEffect(() => {
    if (location.pathname.startsWith('/subject/')) {
      setShowSubjectsDropdown(true);
    } else {
      setShowSubjectsDropdown(false);
    }
  }, [location]);

  const handleMainMenuClick = (path) => {
    if (path !== '/subject') {
      setShowSubjectsDropdown(false);
    }
    navigate(path);
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  const handleSubjectsMenuClick = () => {
    setShowSubjectsDropdown(!showSubjectsDropdown);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img src={usthLogo} alt="USTH Logo" className="usthlogo" />
      </div>

      <div className="sidebar-menu">
        {mainMenuItems.map((item) => (
          <React.Fragment key={item.text}>
            <div
              className={`sidebar-item ${
                location.pathname === item.path ||
                (item.text === 'Subjects' && location.pathname.startsWith('/subject/')) ||
                (item.text === 'Setting' && showSettings)
                  ? 'active'
                  : ''
              }`}
              onClick={
                item.text === 'Subjects'
                  ? handleSubjectsMenuClick
                  : item.text === 'Setting'
                  ? handleSettings // Call handleSettings for "Setting"
                  : () => handleMainMenuClick(item.path)
              }
            >
              <img src={item.icon} alt={item.text} className="sidebar-icon" />
              <span>{item.text}</span>
            </div>

            {/* Submenu for Subjects */}
            {item.dropdown && showSubjectsDropdown && (
              <div className="sidebar-submenu">
                {isLoadingSubjects ? (
                  <div className="sidebar-subitem loading">Loading...</div>
                ) : (
                  subjects.map((subject) => (
                    <div
                      key={subject.subject_id}
                      className={`sidebar-subitem ${
                        location.pathname === `/subject/${subject.subject_id}` ? 'active' : ''
                      }`}
                      onClick={() => handleSubjectClick(subject.subject_id)}
                    >
                      <span>{subject.subject_name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="sidebar-logout" onClick={handleLogout}>
        <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
        <span>Logout</span>
      </div>

      {/* Setting Modal */}
      {showSettings && <Setting closeSettings={() => setShowSettings(false)} />}
    </div>
  );
}