import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import ReportPage from "./report/report";
import SearchLostItem from "./search/search";
import HomePage from "./homepage/homepage";
import Login from "./loginpage/login";
import Profile from "./profile/profile";
import AdminPanel from "./admin/admin";

import defaultProfile from "./assets/profile.png";

import NotificationsDropdown from "./notifications/notification";
import { unreadCount } from "./notifications/notifications";

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(defaultProfile);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedLogoutButton, setSelectedLogoutButton] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("lostAndFoundUser", user);
    } else {
      localStorage.removeItem("lostAndFoundUser");
      setActivePage("home");
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem("lostAndFoundUser");
    if (savedUser) setUser(savedUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const allProfiles = JSON.parse(localStorage.getItem("allProfiles") || "{}");
    const profile = allProfiles[user] || {};

    setProfilePhoto(profile.photoPreview || defaultProfile);
    setProfileName(profile.name || "");
    setProfilePhone(profile.phone || "");
  }, [user]);

  useEffect(() => {
    if (user) setNotifCount(unreadCount(user));
    const handler = () => setNotifCount(unreadCount(user));
    window.addEventListener("notifications-updated", handler);
    return () => window.removeEventListener("notifications-updated", handler);
  }, [user]);


  useEffect(() => {
    const handler = (e) => setActivePage(e.detail);
    window.addEventListener("nav", handler);
    return () => window.removeEventListener("nav", handler);
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      <header className="lsu-header">
        <div className="header-content">
          <img src="/paw.png" alt="LSU Logo" className="lsu-logo" />
          <h1 className="header-title">Tiger Claim</h1>
        </div>

        <div className="top-right-icons">
          <div
            className="notification-icon"
            onClick={() => setShowNotif(!showNotif)}
          >
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            {notifCount > 0 && <span className="notif-badge"></span>}
          </div>

          <img
            src={profilePhoto}
            alt="Profile"
            className="top-right-icon"
            onClick={() => setIsProfileOpen(true)}
          />

          {showNotif && (
            <NotificationsDropdown
              user={user}
              onClose={() => {
                setNotifCount(unreadCount(user));
                setShowNotif(false);
              }}
            />
          )}
        </div>
      </header>

      {isProfileOpen && (
        <Profile
          onClose={() => setIsProfileOpen(false)}
          onProfileUpdate={(updatedProfile) => {
            setProfilePhoto(updatedProfile.photoPreview || defaultProfile);
            setProfileName(updatedProfile.name || "");
            setProfilePhone(updatedProfile.phone || "");
          }}
        />
      )}

      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            <li
              className={activePage === "home" ? "active" : ""}
              onClick={() => setActivePage("home")}
            >
              Welcome
            </li>

            {user === "admin@lsu.edu" && (
              <li
                className={activePage === "admin" ? "active" : ""}
                onClick={() => setActivePage("admin")}
              >
                Admin Panel
              </li>
            )}

            <li
              className={activePage === "search" ? "active" : ""}
              onClick={() => setActivePage("search")}
            >
              Search Lost & Found
            </li>

            <li
              className={activePage === "report" ? "active" : ""}
              onClick={() => setActivePage("report")}
            >
              Report Lost & Found
            </li>

            <li className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Logout
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activePage === "home" && <HomePage user={user} />}
          {activePage === "admin" && user === "admin@lsu.edu" && <AdminPanel />}
          {activePage === "search" && <SearchLostItem />}
          {activePage === "report" && <ReportPage />}
        </main>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Group 6 | Tiger Claim • All Rights Reserved
      </footer>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{user.split("@")[0]}</h3>
            <p>Are you sure you want to log out?</p>

            <div className="modal-buttons">
              <button
                className={`logout-btn-select ${
                  selectedLogoutButton === "yes" ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedLogoutButton("yes");
                  setTimeout(() => {
                    setUser(""); // Clears user and localStorage via effect
                    setShowLogoutModal(false);
                    setSelectedLogoutButton(null);
                  }, 300);
                }}
              >
                Yes
              </button>
              <button
                className={`logout-btn-select ${
                  selectedLogoutButton === "no" ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedLogoutButton("no");
                  setTimeout(() => {
                    setShowLogoutModal(false);
                    setSelectedLogoutButton(null);
                  }, 300);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
