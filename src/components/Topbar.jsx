import React from "react";
import menuIcon from "../assets/menu.png";
import logoIcon from "../assets/usthlogo.png";
import "./Topbar.css";

const TopBar = ({ toggleSidebar, toggleHistory }) => {
  

  return (
    <div className="top-bar">
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
