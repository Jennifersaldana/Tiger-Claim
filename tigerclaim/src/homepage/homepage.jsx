import React from "react";
import "./homepage.css";
import lsuImage from "../assets/lsu-logo.svg"; 

const HomePage = ({ user }) => {
  return (
    <div className="home-container">

      <div className="home-card welcome-flex">
        
        <img src={lsuImage} alt="LSU Campus" className="welcome-img" />

        <div className="welcome-text">
          <h1>Welcome, {user.split("@")[0]}!</h1>
          <p>Your one-stop solution for reporting and finding lost & found items on campus.</p>
        </div>

      </div>

      <div className="feature-section">
        <h2>How Tiger Claim Works</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>Search Found Items</h3>
            <p>Browse all reported found items or filter based on category or location.</p>
          </div>

          <div className="feature-card">
            <h3>Report a Lost Item</h3>
            <p>Lost something important? Create a report so others know what to look for.</p>
          </div>

          <div className="feature-card">
            <h3>Report a Found Item</h3>
            <p>If you find something on campus, report it so other Tigers can locate it quickly.</p>
          </div>

        </div>
      </div>

      <div className="map-wrapper">
        <iframe
          src="https://map.concept3d.com/?id=743#!ct/0?s/"
          title="LSU Campus Map"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

    </div>
  );
};

export default HomePage;
