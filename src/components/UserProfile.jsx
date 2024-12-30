import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import TopBar from "./teacherTopbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    user_name: "",
    email: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).user_id
        : null;
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;

      if (!userId || !token) {
        setError("User ID or authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/userProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const parsedBody = JSON.parse(response.data.body);
        setProfile(parsedBody.data);
        setOriginalProfile(parsedBody.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user profile.");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const isProfileChanged = () => {
    return JSON.stringify(profile) !== JSON.stringify(originalProfile);
  };

  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).user_id
      : null;
    const token = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).access_token
      : null;

    if (!isProfileChanged()) {
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/userProfile/${userId}`,
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
          dob: profile.dob,
          user_name: profile.user_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOriginalProfile(profile);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user profile.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="page_container">
      <TopBar toggleSidebar={toggleSidebar} onLogout={handleLogout} />

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      <div className="user_container">
        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <>
            {/* Header */}
            <header className="user_header">
              <div className="user_header-left">
                <h1 className="user_header-title">
                  Welcome, {originalProfile?.user_name || "User"}
                </h1>
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
                  <h2 className="user_profile-name">
                    {originalProfile?.user_name}
                  </h2>
                  <p className="user_profile-email">{profile.email}</p>
                </div>
                <button
                  className={`user_profile-update ${
                    isProfileChanged() ? "" : "disabled"
                  }`}
                  onClick={handleUpdateProfile}
                  disabled={!isProfileChanged()}
                >
                  Update
                </button>
              </div>

              {/* Form Section */}
              <div className="user_form">
                <div className="user_form-row">
                  <div className="user_form-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Enter your first name"
                      value={profile.first_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="user_form-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Enter your last name"
                      value={profile.last_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="user_form-row">
                  <div className="user_form-field">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="user_form-field">
                    <label>Username</label>
                    <input
                      type="text"
                      name="user_name"
                      placeholder="Enter your user name"
                      value={profile.user_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Email Section */}
              <div className="user_emails">
                <h3>My Email Address</h3>
                <div className="user_email-item">
                  <p>{profile.email}</p>
                </div>
              </div>

              {/* Success Notification */}
              {updateSuccess && (
                <div className="user_update-success">
                  Profile updated successfully!
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;