import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";



// Pages
import ReportFoundItem from "./report-found-item/found";
import SearchLostItem from "./search-lost-item/search";
import HomePage from "./homepage/homepage";
import Login from "./loginpage/login";
import Profile from "./profile/profile"; // Profile modal
import ReportLostItem from "./reportlostitem/lost";

// Assets
import defaultProfile from "./assets/profile.png";

// Notifications System
import NotificationsDropdown from "../src/notifications/notification";
import { unreadCount } from "../src/notifications/notifications";

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(defaultProfile);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  // Load unread notifications when user loads
  useEffect(() => {
    if (user) setNotifCount(unreadCount(user));
  }, [user]);

  // Load saved user email
  useEffect(() => {
    const saved = localStorage.getItem("lostAndFoundUser");
    if (saved) setUser(saved);
  }, []);

  // Load saved profile photo
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profileData") || "{}");
    if (savedProfile?.photoPreview) {
      setProfilePhoto(savedProfile.photoPreview);
    }
  }, []);

  // Listener for navigation from HomePage
  useEffect(() => {
    const handler = (e) => setActivePage(e.detail);
    window.addEventListener("nav", handler);
    return () => window.removeEventListener("nav", handler);
  }, []);

  // If NOT logged in → show Login
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

        {/* TOP RIGHT ICON BAR (INSIDE HEADER NOW!) */}
        <div className="top-right-icons">

          {/* NOTIFICATION BELL */}
          <div
            className="notification-icon"
            onClick={() => setShowNotif(!showNotif)}
          >
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            {notifCount > 0 && (
              <span className="notif-badge">{notifCount}</span>
            )}
          </div>

          {/* PROFILE ICON */}
          <img
            src={profilePhoto}
            alt="Profile"
            className="top-right-icon"
            onClick={() => setIsProfileOpen(true)}
          />

          {/* NOTIFICATION DROPDOWN */}
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

      {/* Profile modal */}
      {isProfileOpen && (
        <Profile
          onClose={() => {
            setIsProfileOpen(false);
            const savedProfile = JSON.parse(
              localStorage.getItem("profileData") || "{}"
            );
            if (savedProfile?.photoPreview)
              setProfilePhoto(savedProfile.photoPreview);
          }}
        />
      )}

      {/* LAYOUT */}
      <div className="main-layout">

        <aside className="sidebar">
          <ul>
            {/* HOME ICON */}
            <li
              className={activePage === "home" ? "active" : ""}
              onClick={() => setActivePage("home")}
            >
              <img src="/home.png" alt="Home" className="sidebar-icon" />
            </li>
<li onClick={() => setActivePage("reportlost")}>Report Lost Item</li>

            {/* REPORT FOUND */}
            <li
              className={activePage === "report" ? "active" : ""}
              onClick={() => setActivePage("report")}
            >
              Report Found Item
            </li>

            {/* SEARCH LOST */}
            <li
              className={activePage === "search" ? "active" : ""}
              onClick={() => setActivePage("search")}
            >
              Search Lost Item
            </li>

            {/* LOGOUT */}
            <li
              className="logout-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  localStorage.removeItem("lostAndFoundUser");
                  setUser("");
                  setActivePage("home");
                }
              }}
            >
              Logout
            </li>
          </ul>
        </aside>

        {/* PAGE CONTENT */}
        <main className="main-content">
          {activePage === "home" && <HomePage user={user} />}
          {activePage === "report" && <ReportFoundItem />}
          {activePage === "search" && <SearchLostItem />}
          {activePage === "reportlost" && <ReportLostItem />}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Group 6 | Tiger Claim • All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
