import React, { useState, useEffect } from "react";
import "./App.css";

// Pages
import ReportFoundItem from "./report-found-item/found";
import SearchLostItem from "./search-lost-item/search";
import HomePage from "./homepage/homepage";
import Login from "./loginpage/login";

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState("");

  // Load LSUE email if saved
  useEffect(() => {
    const saved = localStorage.getItem("lostAndFoundUser");
    if (saved) setUser(saved);
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
      </header>

      {/* LAYOUT */}
      <div className="main-layout">

      <aside className="sidebar">
  <ul>

    {/* HOME ICON — now at TOP */}
    <li
      className={activePage === "home" ? "active" : ""}
      onClick={() => setActivePage("home")}
    >
      <img
        src="/home.png"
        alt="Home"
        className="sidebar-icon"
      />
    </li>

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
