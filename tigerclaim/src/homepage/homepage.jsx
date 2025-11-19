import React from "react";
import "./homepage.css";

const HomePage = ({ user }) => {
  return (
    <div className="home-container">

      {/* WELCOME SECTION */}
      <div className="home-card">
        <h1>Welcome, {user.split("@")[0]}!</h1>
        <p>Your one-stop solution for reporting and finding lost & found items on campus.</p>
    
      </div>

      {/* FEATURE EXPLANATIONS */}
      <div className="feature-section">
        <h2>How Tiger Claim Works</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>📝 Report Found Item</h3>
            <p>
              If you find something on campus, report it so other Tigers can locate it quickly.
            </p>
          </div>

          <div className="feature-card">
            <h3>📣 Report Lost Item</h3>
            <p>
              Lost something important? Create a report so others know what to look for.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔍 Search Items</h3>
            <p>
              Browse all reported found items or filter based on category or location.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HomePage;
