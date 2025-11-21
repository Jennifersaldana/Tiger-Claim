import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

// Pages
import ReportFoundItem from "./report-found-item/found";
import SearchLostItem from "./search-lost-item/search";
import HomePage from "./homepage/homepage";
import Login from "./loginpage/login";
import Profile from "./profile/profile"; 
import ReportLostItem from "./reportlostitem/lost";  // <-- KEEP THIS

// Assets
import defaultProfile from "./assets/profile.png";

// Notifications
import NotificationsDropdown from "../src/notifications/notification";
import { unreadCount } from "../src/notifications/notifications";

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(defaultProfile);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  // Load saved user email
  useEffect(() => {
    const savedUser = localStorage.getItem("lostAndFoundUser");
    if (savedUser) setUser(savedUser);
  }, []);

  // Load saved profile for current user
  useEffect(() => {
    if (!user) return;

    const allProfiles = JSON.parse(localStorage.getItem("allProfiles") || "{}");
    const profile = allProfiles[user] || {};

    setProfilePhoto(profile.photoPreview || defaultProfile);
    setProfileName(profile.name || "");
    setProfilePhone(profile.phone || "");
  }, [user]);

  // Load unread notifications
  useEffect(() => {
    if (user) setNotifCount(unreadCount(user));
  }, [user]);

  // Navigation listener
  useEffect(() => {
    const handler = (e) => setActivePage(e.detail);
    window.addEventListener("nav", handler);
    return () => window.removeEventListener("nav", handler);
  }, []);

  // If not logged in → login page
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="lsu-header">
        <div className="header-content">
          <img src="/paw.png" alt="LSU Logo" className="lsu-logo" />
          <h1 className="header-title">Tiger Claim</h1>
        </div>

        <div className="top-right-icons">

          {/* NOTIFICATIONS */}
          <div
            className="notification-icon"
            onClick={() => setShowNotif(!showNotif)}
          >
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
          </div>

          {/* PROFILE ICON */}
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

      {/* PROFILE MODAL */}
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

      {/* LAYOUT */}
      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            <li
              className={activePage === "home" ? "active" : ""}
              onClick={() => setActivePage("home")}
            >
              <img src="/home.png" alt="Home" className="sidebar-icon" />
            </li>

            {/* REPORT LOST ITEM — ADDED BACK */}
            <li
              className={activePage === "reportlost" ? "active" : ""}
              onClick={() => setActivePage("reportlost")}
            >
              Report Lost Item
            </li>

            <li
              className={activePage === "report" ? "active" : ""}
              onClick={() => setActivePage("report")}
            >
              Report Found Item
            </li>

            <li
              className={activePage === "search" ? "active" : ""}
              onClick={() => setActivePage("search")}
            >
              Search Lost Item
            </li>

            <li
              className="logout-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  localStorage.removeItem("lostAndFoundUser");
                  setUser("");
                  setActivePage("home");
                  setProfilePhoto(defaultProfile);
                  setProfileName("");
                  setProfilePhone("");
                }
              }}
            >
              Logout
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activePage === "home" && <HomePage user={user} />}
          {activePage === "report" && <ReportFoundItem />}
          {activePage === "search" && <SearchLostItem />}
          {activePage === "reportlost" && <ReportLostItem />} {/* KEEP */}
        </main>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Group 6 | Tiger Claim • All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
