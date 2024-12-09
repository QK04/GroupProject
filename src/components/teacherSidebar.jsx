import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import logoutIcon from '../assets/logout.png';
import settingIcon from '../assets/settings.png';
import usthLogo from '../assets/usthlogo.png';
import Setting from './SidebarItem/Setting';
import theoryIcon from '../assets/theory.png';
import testIcon from '../assets/test.png';
import questionbankIcon from '../assets/questionbank.png';
import subjectIcon from '../assets/subject.png';

export default function Sidebar({ isOpen, toggleSidebar, onTestClick }) {  // Nhận onTestClick từ props
  const [showSettings, setShowSettings] = useState(false);

  const mainMenuItems = [
    { text: 'Subjects', icon: subjectIcon },
    { text: 'Theory', icon: theoryIcon },
    { text: 'Question Bank', icon: questionbankIcon },
    { text: 'Test', icon: testIcon },
    { text: 'Setting', icon: settingIcon },
  ];
  const navigate = useNavigate();
  const handleMainMenuClick = (menuItem) => {
    switch (menuItem) {
      case 'Subjects':
        toggleSidebar();
        navigate('/SubjectCard');
        break;
      case 'Theory':
        break;  
      case 'Test':
        toggleSidebar();
        navigate('/FullListTest'); 
        break;
      case 'Question Bank':
        toggleSidebar();
        navigate('/QuestionBank');
        break;
      case 'Setting':
        toggleSidebar();
        handleSettings();
        break;
      default:
        break;
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    toggleSidebar();
  };

  return (
    <>
      <Drawer open={isOpen} onClose={toggleSidebar} anchor="left">
        <Box className="sidebar-container" role="presentation">
          <List>
            <img src={usthLogo} alt="USTH Logo" className="usthlogo" />
          </List>

          <Divider className="divider" />

          {/* Main Menu Items */}
          <List>
            {mainMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => handleMainMenuClick(item.text)}>
                  <ListItemIcon>
                    <img src={item.icon} alt={item.text} style={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider className="divider" />

          {/* Logout Section */}
          <div className="logout-section">
            <Divider className="divider" />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <img src={logoutIcon} alt="Logout" style={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </div>
        </Box>
      </Drawer>

      {showSettings && <Setting closeSettings={() => setShowSettings(false)} />}
    </>
  );
}