import React, { useState, useEffect } from "react";
import "./App.css";
import ReportFoundItem from "./report-found-item/found";
import SearchLostItem from "./search-lost-item/search";
import Login from "./loginpage/login";

const App = () => {
  const [activePage, setActivePage] = useState("report");
  const [user, setUser] = useState("");

  // Load saved user (LSU email)
  useEffect(() => {
    const saved = localStorage.getItem("lostAndFoundUser");
    if (saved) setUser(saved);
  }, []);

  // Show login page if user not logged in
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
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        <aside className="sidebar">
          <ul>
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

            {/* LOGOUT BUTTON WITH CONFIRMATION */}
            <li
              className="logout-btn"
              onClick={() => {
                const confirmLogout = window.confirm(
                  "Are you sure you want to log out?"
                );

                if (confirmLogout) {
                  localStorage.removeItem("lostAndFoundUser");
                  setUser("");
                }
              }}
            >
              Logout
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activePage === "report" && <ReportFoundItem />}
          {activePage === "search" && <SearchLostItem />}
        </main>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Group 6 | Tiger Claim • All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
