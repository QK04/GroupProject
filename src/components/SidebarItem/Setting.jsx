import React, { useState } from 'react';
import Modal from '../Modal'; // Ensure you have the Modal component
import './Setting.css';

function Setting({ closeSettings }) {
  const [isAlwaysShowCode, setIsAlwaysShowCode] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(true);

  const handleToggle = () => {
    setIsAlwaysShowCode(!isAlwaysShowCode);
  };

  const handleThemeToggle = () => {
    setIsLightTheme(!isLightTheme);
  };

  return (
    <Modal isOpen={true} onClose={closeSettings}>
      <div className="settings-container">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={closeSettings}>
            ✖
          </button>
        </div>
        <div className="settings-content">
          {/* Theme Toggle */}
          <div className="settings-item">
            <span>Theme</span>
            <div className="toggle-container">
              <span className="spanmargin">Light</span>
              <button
                className={`toggle-switch ${isLightTheme ? 'on' : 'off'}`}
                onClick={handleThemeToggle}
              ></button>
              <span className="spanmargin">Dark</span>
            </div>
          </div>
          <hr />

          {/* Always Show Code Toggle */}
          <div className="settings-item">
            <span>Always show code when using data analyst</span>
            <div className="toggle-container">
              <span className="spanmargin">Off</span>
              <button
                className={`toggle-switch ${isAlwaysShowCode ? 'on' : 'off'}`}
                onClick={handleToggle}
              ></button>
              <span className="spanmargin">On</span>
            </div>
          </div>

          {/* Language Dropdown */}
          <div className="settings-item">
            <span>Language</span>
            <select className="dropdown">
              <option>Auto-detected</option>
              <option>English</option>
              <option>Vietnamese</option>
            </select>
          </div>

          {/* Archived Chats */}
          <div className="settings-item">
            <span>Archived chats</span>
            <button className="manage-button">Manage</button>
          </div>

          {/* Archive All Chats */}
          <div className="settings-item">
            <span>Archive all chats</span>
            <button className="action-button">Archive all</button>
          </div>

          {/* Delete All Chats */}
          <div className="settings-item">
            <span>Delete all chats</span>
            <button className="action-button delete">Delete all</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Setting;
