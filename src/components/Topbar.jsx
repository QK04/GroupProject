import React from "react";
import menuIcon from "../assets/menu.png";
import logoIcon from "../assets/usthlogo.png";
import historyIcon from "../assets/history.png";
import "./TopBar.css";

const TopBar = ({ toggleSidebar, toggleHistory }) => {
  

  return (
    <div className="top-bar">
      {/* History Toggle */}
        <img
          src={historyIcon}
          alt="History Icon"
          className="history-toggle"
          onClick={toggleHistory}
        />
        
      <img
        src={menuIcon}
        alt="Menu"
        className="menu-toggle"
        onClick={toggleSidebar}
      />
      {/* Logo */}
      <div className="logo-center">
        <img src={logoIcon} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default TopBar;
