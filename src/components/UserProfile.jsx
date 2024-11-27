import React from "react";
import "./UserProfile.css";

const UserProfile = () => {
    return (
        <div className="user_container">
            {/* Header */}
            <header className="user_header">
                <div className="user_header-left">
                    <h1 className="user_header-title">Welcome, User</h1>
                    <p className="user_header-date">Tue, 07 June 2022</p>
                </div>
            </header>

            {/* Profile Info */}
            <main className="user_profile">
                <div className="user_profile-header">
                    <img
                        src="https://via.placeholder.com/80"
                        alt="User Avatar"
                        className="user_profile-avatar"
                    />
                    <div>
                        <h2 className="user_profile-name">User Name</h2>
                        <p className="user_profile-email">a@gmail.com</p>
                    </div>
                    <button className="user_profile-edit">Edit</button>
                </div>

                {/* Form Section */}
                <div className="user_form">
                    <div className="user_form-row">
                        <div className="user_form-field">
                            <label>First Name</label>
                            <input type="text" placeholder="Enter your first name"/>
                        </div>
                        <div className="user_form-field">
                            <label>Last Name</label>
                            <input type="text" placeholder="Enter your last name"/>
                        </div>
                    </div>
                    <div className="user_form-row">
                        <div className="user_form-field">
                            <label>Date of Birth</label>
                            <input type="date"/>
                        </div>
                        <div className="user_form-field">
                            <label>Username</label>
                            <input type="text" placeholder="Enter your user name"/>
                        </div>
                    </div>
                </div>

                {/* Email Section */}
                <div className="user_emails">
                    <h3>My Email Address</h3>
                    <div className="user_email-item">
                        <p>example@gmail.com</p>
                    </div>
                    <button className="user_email-add">+ Add Email Address</button>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
