import React from "react";
import menuIcon from "../assets/menu.png";
import logoIcon from "../assets/usthlogo.png";
import "./TopBar.css";

const TopBar = ({ toggleSidebar, historyProps = {}}) => {
  const { icon, action } = historyProps;

  return (
    <div className="top-bar">
      {/* History Toggle */}
      {icon && (
        <img
          src={historyProps.icon}
          alt="History Icon"
          className="history-toggle"
          onClick={historyProps.action}
        />
      )}  
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
