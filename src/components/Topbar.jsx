import React from 'react';
import menuIcon from '../assets/menu.png';
import logoIcon from '../assets/usthlogo.png';
import sidebarRightIcon from '../assets/sidebar-right.png';

import './Topbar.css';

const TopBar = ({ toggleSidebar, toggleHistory }) => {
  return (
    <div className="top-bar">
      
      <img  
        src={sidebarRightIcon} 
        alt="History" 
        className="history-toggle"
        onClick={toggleHistory} 
      />
      
      <img
        src={menuIcon}
        alt="Menu"
        className="menu-toggle"
        onClick={toggleSidebar}
      />
      <div className='logo-center'>
        <img src={logoIcon} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default TopBar;
