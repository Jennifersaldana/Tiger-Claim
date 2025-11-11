import React, {useState} from "react";
import "./App.css";
import ReportFoundItem from "./report-found-item/found";
import SearchLostItem from "./search-lost-item/search";

const App = () => {
  const [activePage, setActivePage] = useState("report");
  
  return (
    <div className="app-container">
      <header className="lsu-header">
        <div className="header-content">
          <img
            src="/paw.png"
            alt="LSU Logo"
            className="lsu-logo"
          />
          <h1 className="header-title">Tiger Claim</h1>
        </div>
      </header>

     {/* Main Layout */}
     <div className="main-layout">
        {/* Sidebar Navigation */}
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
          </ul>
        </aside>

        <main className="main-content">
          {activePage === "report" && <ReportFoundItem/>}
          {activePage === "search" && <SearchLostItem/>}
        </main>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Group 6 | Tiger Claim • All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
