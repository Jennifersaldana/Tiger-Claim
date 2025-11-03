import React from "react";
import "./App.css";
import ReportLostItem from "./report-lost-item/report";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="lsu-header">
        <div className="header-content">
          <img
            src="/tiger-claim-pic.jpeg"
            alt="LSU Logo"
            className="lsu-logo"
          />
          <h1 className="header-title">Tiger Claim</h1>
        </div>
      </header>

      <div className="main-layout">
        <nav className="sidebar">
          <ul>
            <li className="active">Report Lost Item</li>
            <li>Search Lost Item</li>
          </ul>
        </nav>

        <main className="main-content">
          <ReportLostItem />
        </main>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Group 6 • All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
